module com.wwyx
{

	export class TileGrid extends BaseUI
	{
            //lon 经度 越大越右 lat 纬度 越大越向上
		   private well:egret.Sprite;
		   //private _center:Location=new Location(37.85750715625204,112.5439453125);//纬度 经度 
		   private _center:Location=new Location(24.046464,45.915985);
       private _zoom:number=8;
 			
 		   private mapWidth:number=800;
 		   private mapHeight:number=600;

		   private hscale:number;//横向缩放系数
		   private vscale:number;//纵向 缩放系数 

		   private temp:egret.Shape;
		   private centerChange:boolean=true;
       private zoomChange:boolean=false;
       private loadTiles:Tile[]=new Array();

       private tilePool:TilePool; 

		   public constructor(width:number=800,height:number=600) {
        		super();
            this.mapWidth=width;
            this.mapHeight=height;
        		//this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    	   }

    	   public addChildren():void
    	   {
    	   		super.addChildren();
    	   		this.well=new egret.Sprite();
    	   		this.addChild(this.well);
            this.tilePool=new TilePool(null);
            
    	   }
         public set mapProvider(provider:IMapProvider)
         {
            Tile.mapProvider=provider;
            this.zoomChange=true;
            this.invalidate();
         }
    	   public set center(value:Location)
    	   {
    	   		if(!value.equals(this._center))
    	   		{
    	   			this.centerChange=true;
    	   			this._center=value;
    	   			this.invalidate();
    	   		}
    	   }
           public set zoom(value:number)
           {
                if(value!=this._zoom)
                {
                    this._zoom=value;
                    this.zoomChange=true;
                    this.invalidate();
                }

           }
           public get zoom():number
            {
              return this._zoom;
            }
           public get center():Location
            {
               return this._center;
            }
           public updateTilesByDis(disX:number,disY:number):void
           {
                console.log(this.well.numChildren);
                for(var i:number=0;i<this.well.numChildren;i++)
                {
                    var tile:egret.DisplayObject=<egret.DisplayObject>this.well.getChildAt(i);
                    tile.x=tile.x+disX;//+=有问题
                    tile.y=tile.y+disY;
                }
           }



           public panTo(distancePoint:egret.Point):void
           {
                var coor:Coordinate=Util.getTile(this._center,this._zoom);//获取
                var extent:MapExtent=Util.getTileExtent(coor);//获取tile范围
                var scale:egret.Point=Util.getPixelScale(extent);//根据tile范围获取缩放系数
                this._center.lon=this._center.lon-scale.x*distancePoint.x; //经纬度方向和flash方向不一致
                this._center.lat=this._center.lat+(scale.y*distancePoint.y);
                console.log(this._center);
                this.centerChange=true;
                this.invalidate();
           }

          //获取tiles的区域
          private getTilesRectangle(coordinate:Coordinate,ltCount:egret.Point):egret.Rectangle
          {
             
              var leftCount:number=ltCount.x;
              var rightCount:number=leftCount+1; //
              var topCount:number=ltCount.y;
              var bottomCount:number=topCount+1;

              var rowCount:number=topCount+bottomCount+1;//coordinate 算一个 
              var colCount:number=leftCount+rightCount+1;//coordinate  算一个 

              var startRowNum:number=coordinate.row-leftCount;//topCount;//开始row编号 
              var startColNum:number=coordinate.column-topCount;//leftCount;//开始的col编号

              var tileRect:egret.Rectangle=new egret.Rectangle(startRowNum,startColNum,startRowNum+colCount,startColNum+rowCount);
              return tileRect;
             
         }
         //获取左上角剩余 Tile个数
         private getLeftTopTileCount(pixel:egret.Point):egret.Point
         {
              var leftPixel:number=this.mapWidth/2-pixel.x;//左边剩余像素
              var topPixel:number=this.mapHeight/2-pixel.y;//上方剩余像素
              var leftCount:number=Math.floor(leftPixel/Util.tile_size)+1;
              var topCount:number=Math.floor(topPixel/Util.tile_size)+1;
              return new egret.Point(leftCount,topCount);
         } 

         /* *********************
            *  ************     *
            *   *          *    *
            *   *    A     *    *
            *  *          *     *
            *   ************    *
            *
            *********************

          */  
          //比较两个矩形  返回不包含A的部分  然后从well中删除
         private compareRect(newRect:egret.Rectangle,oldRect:egret.Rectangle):egret.Rectangle
         {
              return new egret.Rectangle(newRect.x-oldRect.x,newRect.y-oldRect.y,newRect.width-oldRect.width,newRect.height-oldRect.height);
         }

         private deleteNoInRect(newRect:egret.Rectangle,oldRect:egret.Rectangle,residue_rect:egret.Rectangle)
         {
              //删除左边
             /*
              var leftColNum:number=newRect.x-residue_rect.x; //左边列数
              var topRowNum:number=residue_rect.x
              var startRowNum:number=number=leftColNum; //左边开始Row num

              for(var row:number=startRowNum,i<Math.abs(residue_rect.width);i++)//单行当行的删除
              {
                   
                   delete this.tileMap[this._zoom+"/"+row+"/"+tilehis.column;];
              }
              */
              //var leftCol:number=newRect.y-residue_rect.y;
         }

         private preTileRect:egret.Rectangle;
         private preTiles:Tile[][]=[];//上次加载的 Tile2维数组
         private tileMap:any={};

    	   private updateTiles(clear:boolean=false):void
    	   {
    	   		    var coor:Coordinate=Util.getTile(this._center,this._zoom);//获取tile
    	   		    var pixel:egret.Point=Util.getPixelByLocation(this._center,this._zoom);//获取像素
    	   		
                var ltCount:egret.Point=this.getLeftTopTileCount(pixel);//获取left top Count
                var tilesRect:egret.Rectangle=this.getTilesRectangle(coor,ltCount);//获取Tile 区域
                var residue_rect:egret.Rectangle=new egret.Rectangle(0,0,0,0);
                if(this.preTileRect)
                {
                    residue_rect=this.compareRect(tilesRect,this.preTileRect);//获取差异部分
                }
                this.preTileRect=tilesRect;
                var leftPixel:number=this.mapWidth/2-pixel.x;//左边剩余像素
                var topPixel:number=this.mapHeight/2-pixel.y;//上方剩余像素

                var startX:number=Math.floor(leftPixel-ltCount.x*Util.tile_size);
                var starty:number=Math.floor(topPixel-ltCount.y*Util.tile_size);
                
                var numChild:number=this.well.numChildren;

                if(clear)
                {
                    for(var c:number=numChild-1;c>=0;c--)
                    {
                        this.well.removeChildAt(c);
                    }
                    this.tileMap={};
                    
                }else
                { 
                    
                    for(var key in this.tileMap)
                    {
                         this.tileMap[key].use=false;//所有重置为false
                    }
                    
                }
                
                var index=0;
                for(var i:number=tilesRect.x;i<=tilesRect.width;i++)// row
                {           
                    //this.preTiles[i-tilesRect.x]=[];        
                    for(var j:number=tilesRect.y;j<=tilesRect.height;j++)
                    {
                        var tilecoor:Coordinate=new Coordinate(i,j,this._zoom);
                        var nx:number=startX+((i-tilesRect.x)*Util.tile_size);
                        var ny:number=starty+((j-tilesRect.y)*Util.tile_size);
                        var tilePoint:egret.Point=new egret.Point(nx,ny);
                        var tile:Tile=<Tile>(this.tileMap[tilecoor.toString()]?this.tileMap[tilecoor.toString()].tile:null);//判断已加载是否已有
                        if(!tile)
                        {
                           tile=this.tilePool.getTile(tilecoor);
                           this.well.addChild(tile);
                           tile.load();
                        }
                        tile.moveTo(tilePoint);
                        this.tileMap[tilecoor.toString()]={use:true,tile:tile};
                        //this.preTiles[i-tilesRect.x][j-tilesRect.y]=tile;
                    }
                }
                
                for(var key in this.tileMap)
                {
                      var item:any=this.tileMap[key];
                      if(!item.use)
                      {
                           this.well.removeChild(<Tile>item.tile);
                           delete this.tileMap[key];
                      }
                }
                
                /*
                for(var z:number=0;z<this.loadTiles.length;z++)
                {
                    var tile:Tile=this.loadTiles[z];
                    if(!tile.isInRect(tilesRect))
                    {
                        try
                        {
                             //this.well.removeChild(tile);
                        }catch(e)
                        {

                        }
                       
                    }
                }
                this.loadTiles=inrect;

    	   		//this.well.removeChildren();
               
    	   		for(var i:number=0;i<loadTiles.length;i++)
    	   		{
    	   			var tile:any=tiles[i];
                    var tileUI:Tile=this.loadTiles[tile.url];
                    if(!tileUI)
                    {
                        tileUI=new Tile();
                        tileUI.name=tile.url;
                        tileUI.url=tile.url;
                        tileUI.load();
                    }
    	   			tileUI.x=tile.point.x;
    	   			tileUI.y=tile.point.y;
    	   			this.well.addChild(tileUI);
    	   		}

               
                var deleteTiles:Tile[]=new Array();
                for(var j:number=0;j<this.well.numChildren;j++)
                {
                    var tileUI1:Tile=<Tile>this.well.getChildAt(j);
                    if(!this.loadTiles[tileUI1.url])
                    {
                        deleteTiles.push(tileUI1);
                    }
                }
                for(var z:number=0;z<deleteTiles.length;z++)
                {
                    this.well.removeChild(tileUI1);
                }
                */
    	   }

    	  // var lat:number = 47.968056; 47.918056 向下越小
          // var lon:number = 7.909167;  //向右越大
    	  // 经度：普通话拼音：jīng dù ； 英文：longitude ； 英文读音：/'lɒŋɡɪtjuːd/；美 /'lɑːndʒətuːd/ 南北
		  // 纬度：普通话拼音：wěi dù ； 英文：latitude ; 英文读音：/'lætɪtjuːd/；美 /'lætɪtuːd/ //东西
    	   public draw():void
    	   {
    	   		if(this.centerChange)
    	   		{
    	   			this.centerChange=false;
    	   			this.updateTiles();
    	   		}
            if(this.zoomChange)
            {
               this.zoomChange=false;
               this.updateTiles(true);
            }
                var g:egret.Graphics=this.graphics;
                g.clear();
                g.beginFill(0xffffff,1);
                g.drawRect(0,0,this.mapWidth,this.mapHeight);
                g.endFill();

    	   }



	}

}