interface ResponseLister{

    handlerResponse(status: number, response: string);
    handlerResponseUpdateDevice(status:number,response:string);
    handlerResponseRemoveDevice(status:number,response:string);
    handlerResponseAddDevice(status:number,response:string);

}