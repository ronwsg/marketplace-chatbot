import groovy.json.JsonSlurperClassic


def build(def nexus_server_prefix, def deploy_server) {
	def recipients = load("jenkins/recipients.groovy")
	def digitalPrefix = 'digital_dist-'
	def buildVersion = digitalPrefix + version()+'-' + timestamp()
	def archiveName = buildVersion + '.zip'
	def testsPassed = false
	def lintPassed = false
	def publishedWorked = false
	def deploySuccess = false
	def success = false
	def nexus_url = generate_nexus_url(nexus_server_prefix, buildVersion)


    try {
			//deletes previous distrbutions
			stage('clean') {
				sh "rm -rf dist"
				sh "rm -f ${digitalPrefix}*"
			}

	  //fetches all the dependencies
      stage ('install') {
          npm 'install'
      }

      //Runs ts lint and published the results
      stage ('lint') {
         gulp 'lint'
         step([$class: "CheckStylePublisher",
          canComputeNew: false,
          defaultEncoding: "",
          healthy: "",
          pattern: "build_reports/checkstyle.xml",
          unHealthy: ""])
		  		lintPassed = true
      }

	  //Runs the test with karma and publishes the results
       stage ('test') {
          gulp 'test'
           step([$class: 'JUnitResultArchiver',
           testResults: 'build_reports/test-results/**/test-results.xml'])
              publishHTML([allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: 'build_reports',
              reportFiles: 'test-results/coverage/report-html/index.html',
              reportName: 'Coverage'])
			testsPassed = true

       }

      //it compile the TypeScript files and copies to dist
      stage ('dist') {
         gulp 'dist'
      }

      //zips the dist folder with a convention of digital_dist-[version]-[timestamp].zip
      stage ("zip") {
          echo 'zipping ' + archiveName + '...'
          zip archive: true, dir: 'dist', glob: '', zipFile: archiveName

      }

      //publishes the results to nexus
      stage("publish to nexus") {
				sh("curl -u admin:admin123 --upload-file ${archiveName} -v ${nexus_url}")
				publishedWorked = true
      }

	  	//deploy to staging servers
		  stage("deploy to staging") {
				echo "deploying...."
				//deduce the artifact url
				def deployFolder = "/var/deployment/frontend"
				//download the dist
				runOnRemoteServer(deploy_server,"wget ${nexus_url} -O ${deployFolder}/${buildVersion}.zip")
				//unzip it
				runOnRemoteServer(deploy_server,"unzip -o ${deployFolder}/${buildVersion}.zip -d ${deployFolder}/${buildVersion}")
				//delete the zip file (not needed anymore)
				runOnRemoteServer(deploy_server,"rm -f ${deployFolder}/${buildVersion}.zip")
				//delete the old symbolic link
				runOnRemoteServer(deploy_server,"rm -f ${deployFolder}/selfcare")
				//create a new symbolic link
				runOnRemoteServer(deploy_server,"ln -s ${deployFolder}/${buildVersion} ${deployFolder}/selfcare")
				//make ngnix the owner of the folder
				//runOnRemoteServer(deploy_server,"chown nginx ${deployFolder}/selfcare")
				echo "deployed successfully!"
				deploySuccess = true
		  }

      success = testsPassed && lintPassed && publishedWorked && deploySuccess
    } finally {
        //sends the appripriate email notification
		notify(recipients.defaultRecipients(),testsPassed, lintPassed, publishedWorked, deploySuccess)
    }
}


def notify(def to, def testsPassed, def lintPassed, def publishedWorked, def deploySuccess) {
	def success = testsPassed && lintPassed && publishedWorked && deploySuccess
    emailext (
      subject: "${jobstatus(success)}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      body: """<p>${jobstatus(success)}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
        <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>
		<br>
		Tests status: ${formatBoolResult(testsPassed)}<br>
		Lint status: ${formatBoolResult(lintPassed)}<br>
		Nexus publish status: ${formatBoolResult(publishedWorked)}<br>
		Deployment status: ${formatBoolResult(deploySuccess)}
		</p>""",
      recipientProviders: [],
	  mimeType: "text/html",
	  contentType: "text/html",
      to: to
    )

}

def jobstatus(def success) {
	if (success) return "SUCCESSFUL"
	return"Failed"
}

def formatBoolResult(def result) {
	if (result) return 'success'
	return 'failed'
}

def npm(def cmd) {
    withEnv(["PATH=/usr/local/bin:${env.PATH}"]) {
        sh '/usr/local/bin/npm ' + cmd
    }
}

def gulp(def cmd) {
    withEnv(["PATH=/usr/local/bin:${env.PATH}"]) {
        sh '/usr/local/bin/node node_modules/gulp/bin/gulp.js ' + cmd
    }
}

def runNpm(def cmd) {
    npm('run ' + cmd)
}
def version()  {
    def json = readFile("package.json")
    return new groovy.json.JsonSlurperClassic().parseText(json)["version"]
}


def timestamp() {
    def now = new Date()
    return now.format("yyyyMMdd-HHmmss", TimeZone.getTimeZone('UTC'))

}

def runOnRemoteServer(def server, def cmd) {
	if (server == "localhost" || server == "127.0.0.1" ) sh cmd
	else sh "ssh ${server} ${cmd}"
}

def download(address)
{
    def file = new FileOutputStream(address.tokenize("/")[-1])
    def out = new BufferedOutputStream(file)
    out << new URL(address).openStream()
    out.close()
}
def generate_nexus_url(def nexus_server_prefix, def version) {
		//http://nexus-optima:8081/nexus/service/local/repositories/snapshots/content/com/amd/optima/self-care
    return "${nexus_server_prefix}/dist/ui-frontent/${version}.zip"
}

return this;
