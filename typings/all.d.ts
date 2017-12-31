

interface NodeRequire {
  ensure: (paths: string[], callback: Function, name?: string) => void;
  context(directory: string, useSubDirectories?: boolean, regExp?: RegExp): any;
}

declare module "react-tap-event-plugin" {
  var dummy: any;
  export default dummy;
}

declare interface ObjectConstructor {
  assign(target: any, ...sources): any;
}

declare var expect: Chai.ExpectStatic;

declare module "react-cookie" {
 class Cookies {
    set(name: string, value: Object, options?: Object)
    get(name: string, options?: Object): string | Object;
    getAll(options?: Object): string[] | Object[];
    remove(name: string, options?: Object);
}
  export {Cookies};
}