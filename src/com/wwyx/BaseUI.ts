
module com.wwyx {

	export class BaseUI extends egret.Sprite{
		// NOTE: Flex 4 introduces DefineFont4, which is used by default and does not work in native text fields.
		// Use the embedAsCFF="false" param to switch back to DefineFont4. In earlier Flex 4 SDKs this was cff="false".
		// So if you are using the Flex 3.x sdk compiler, switch the embed statment below to expose the correct version.
		
		// Flex 4.x sdk:
		//[Embed(source="assets/pf_ronda_seven.ttf", embedAsCFF="false", fontName="PF Ronda Seven", mimeType="application/x-font")]
		// Flex 3.x sdk:
		public _width:number = 0;
		public _height:number = 0;
		public _tag:number = -1;
		public _enabled:boolean = true;
		public isDispose:boolean=false;
		public static DRAW:string = "draw";
		public static webSrviceUrl:string="http://192.168.0.171/WebPoint/";
//    	public static const webSrviceUrl:String=YDConfig.instance().getProperties("url_guiji");//"http://192.168.0.171/WebPoint/";
//		public static const webSrviceUrl:String="http://localhost:52864/";
		
		
		
		public constructor(){
			super();
			
			this.init();
			
		}
		
		/**
		 * Initilizes the component.
		 */
		public init():void{
			this.addChildren();
			this.invalidate();
		}
		
		/**
		 * Overriden in subclasses to create child display objects.
		 */
		public addChildren():void{
			
		}
		
		
		
		/**
		 * Marks the component to be redrawn on the next frame.
		 */
		public invalidate():void{
//			draw();
			this.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
		}
		
		
		
		
		///////////////////////////////////
		// public methods
		///////////////////////////////////
		
		
		
		/**
		 * Moves the component to the specified position.
		 * @param xpos the x position to move the component
		 * @param ypos the y position to move the component
		 */
		public move(xpos:number, ypos:number):void{
			this.x = Math.round(xpos);
			this.y = Math.round(ypos);
		}
		
		/**
		 * Sets the size of the component.
		 * @param w The width of the component.
		 * @param h The height of the component.
		 */
		public setSize(w:number, h:number):void{
			this._width = w;
			this._height = h;
			this.invalidate();
			this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
		}
		
		/**
		 * Abstract draw function.
		 */
		public draw():void{
			this.dispatchEvent(new egret.Event(BaseUI.DRAW));
		}
		
		
		
		
		///////////////////////////////////
		// event handlers
		///////////////////////////////////
		
		/**
		 * Called one frame after invalidate is called.
		 */
		public onInvalidate(event:Event):void{
			this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
			this.draw();
		}
		
		
		
		
		///////////////////////////////////
		// getter/setters
		///////////////////////////////////
		
		
		
		public set width(w:number){
			this._width = w;
			this.invalidate();
			this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
		}
		public get width():number{
			return this._width;
		}
		
		public set height(h:number){
			this._height = h;
			this.invalidate();
			this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
		}
		public get height():number{
			return this._height;
		}
		
		
		public set tag(value:number){
			this._tag = value;
		}
		public get tag():number{
			return this._tag;
		}
		
		/*
		public set x(value:number){
			super.x = Math.round(value);
		}
		
		
		public set y(value:number){
			super.y = Math.round(value);

		}
		*/
			
		public set enabled(value:boolean){
			this._enabled = value;
			this.touchEnabled = this.touchChildren = this._enabled;
            //this.tabEnabled = value;
			this.alpha = this._enabled ? 1.0 : 0.5;
		}

		public get enabled():boolean{
			return this._enabled;
		}
		
		public pause():void{
			
		}
		public start():void{
			
		}
		
		public dispose():void{
			this.isDispose=true;
			for(var i:number=0;i<this.numChildren;i++){
				var obj:egret.DisplayObject=this.getChildAt(i);
				
				var cld:BaseUI=<BaseUI><any> obj;
				if(cld){
					cld.dispose();
				}
			}
		}
		

	}
}