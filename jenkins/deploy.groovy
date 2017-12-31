import groovy.json.JsonSlurperClassic 

def success = false;

node() {
	echo "deploy"    
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
