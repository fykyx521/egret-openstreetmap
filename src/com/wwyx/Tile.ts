module com.wwyx
{
	export class Tile extends BaseUI
	{

		public _coordinate:Coordinate;
		private key:string;
		public url:string;
		public static mapProvider:IMapProvider=new OpenStreetMapProvider();
		//private static google:GoogleMapProvider;
		private imgLoader:egret.URLLoader;
		public constructor(){
			super();
		}

		public load():void
		{
			if(!this.imgLoader)
			{
				 this.imgLoader=new egret.URLLoader();
        	 	 this.imgLoader.dataFormat="texture";
        	
			}
			this.imgLoader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
			this.imgLoader.load(new egret.URLRequest(Tile.getTileUrls(this._coordinate)));
        	
		}

		private onLoadComplete(event:egret.Event):void
    	{
       		 var loader:egret.URLLoader = <egret.URLLoader>event.currentTarget;
       		 loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
       		 var data:any = loader.data;
       	 	 var bitmap:egret.Bitmap=new egret.Bitmap();
        	 bitmap.texture=<egret.Texture>data;
      	     this.addChild(bitmap);
    	}

    	public  get coordinate():Coordinate
    	{
    		return this._coordinate;
    	}
    	public  set coordinate(value:Coordinate)
    	{
    		this._coordinate=value;
    		this.url=value.zoom+"/"+value.row+"/"+value.column;
    	}
    	public isInRect(rect:egret.Rectangle):boolean
	    {
	    	return this.coordinate.isInRect(rect);
	    }
	    public moveTo(p:egret.Point)
	    {
	    	this.x=p.x;
	    	this.y=p.y;
	    }

	    public destroy():void
	    {
	    	while (this.numChildren > 0) {
	    		var child:egret.DisplayObject = <egret.DisplayObject>this.removeChildAt(0);
	    	}
	    	this.graphics.clear();
	    }        

	    /*
	    public getTileUrls():String
	    {
	    	return this.baseUrl+this.url+".png");
	    }
	    */

	    public static getTileUrls(coor:Coordinate):string
	    {
	    	return Tile.mapProvider.getTileUrl(coor.row,coor.column,coor.zoom);
	    	//return this.baseUrl+this.url+".png");
	    }
	
	}
}