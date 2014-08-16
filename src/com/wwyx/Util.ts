
module com.wwyx
{
	export class Util
	{
			public static  long2tile(lon:number,zoom:number):number {
			 		return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
			}

 			public static lat2tile(lat:number,zoom:number):number  { 
 				return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); 
 			}

 			public static tilex2lon(x:number,z:number):number
 			{
 				return (x/Math.pow(2,z)*360-180);
 			}
 			public static tiley2lat(y:number,z:number):number {
  				var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  				return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
 			}
      //tile转经纬度 （坐标为tile左上角）
 			public static tile2Location(x:number,y:number,z:number):com.wwyx.Location
 			{
 				var lon:number=Util.tilex2lon(x,z);
 				var lat:number=Util.tiley2lat(y,z);
 				return new com.wwyx.Location(lat,lon); //{lon:lon,lat:lat};
 			}
      //获取 Tile坐标 范围
      public static getTileExtent(coor:Coordinate):MapExtent
      {
           var leftx:number=coor.row;
           var lefty:number=coor.column;
           var rightx:number=coor.row+1;
           var righty:number=coor.column+1;
           var leftTop:com.wwyx.Location=Util.tile2Location(leftx,lefty,coor.zoom);
           var rightBottom:com.wwyx.Location=Util.tile2Location(rightx,righty,coor.zoom);
           return new MapExtent(leftTop.lat,rightBottom.lat,leftTop.lon,rightBottom.lon);
      }


       //根据经纬度获取Tile
 			 public static getTile(loc:Location,zoom:number):Coordinate {
   					//int xtile = (int)Math.floor( (lon + 180) / 360 * (1<<zoom) ) ;
  					//int ytile = (int)Math.floor( (1 - Math.log(Math.tan(Math.toRadians(lat)) + 1 / Math.cos(Math.toRadians(lat))) / Math.PI) / 2 * (1<<zoom) ) ;
    				var xtile:number=Util.long2tile(loc.lon,zoom);
    				var ytile:number=Util.lat2tile(loc.lat,zoom);
    				if (xtile < 0)
     					xtile=0;
   					if (xtile >= (1<<zoom))
     					xtile=((1<<zoom)-1);
    				if (ytile < 0)
     					ytile=0;
    				if (ytile >= (1<<zoom))
     					ytile=((1<<zoom)-1);
    				return new Coordinate (xtile,ytile,zoom);//("" + zoom + "/" + xtile + "/" + ytile);
  			 }
  			 public static tile_size:number=256;
         
         //获取每个像素的坐标比
         public static getPixelScale(extent:MapExtent):egret.Point
         {
             var vscale:number=Math.abs((extent.north-extent.south))/Util.tile_size; //获取比例
             var hscale:number=Math.abs((extent.east-extent.west))/Util.tile_size;
             return new egret.Point(hscale,vscale);
         }

          //获取某个经纬度 在Tile上的像素坐标
         public static getPixelByLocation(_center:Location,zoom:number):egret.Point
         {
            var coordinate:Coordinate=Util.getTile(_center,zoom);
            var extent:MapExtent=Util.getTileExtent(coordinate);
            var vscale:number=Util.tile_size/Math.abs((extent.north-extent.south)); //获取比例
            var hscale:number=Util.tile_size/Math.abs((extent.east-extent.west));
            var disx:number=Math.abs(_center.lon-extent.west);//-east or -west 没搞明白经纬度坐标向下大还是向右大
            var disy:number=Math.abs(_center.lat-extent.north);
            var tilePixelX:number=disx*hscale;
            var tilePixelY:number=disy*vscale;
            //获取坐标点 在Tile上的像素坐标
            var _centerInTilePoint:egret.Point=new egret.Point(Math.floor(tilePixelX),Math.floor(tilePixelY));// x y搞晕了 经纬度的xy与flash不一致 
            console.log(tilePixelX+":"+tilePixelY);
            return _centerInTilePoint;
         }


         public static getTiles(coordinate:Coordinate,pixel:egret.Point,mapWidth:number,mapHeight:number):Array<any>
         {
              var leftPixel:number=mapWidth/2-pixel.x;//左边剩余像素
              var topPixel:number=mapHeight/2-pixel.y;//上方剩余像素
              var leftCount:number=Math.floor(leftPixel/Util.tile_size)+1;
              var rightCount:number=leftCount+1; //
              var topCount:number=Math.floor(topPixel/Util.tile_size)+1;
              var bottomCount:number=topCount+1;

              var rowCount:number=topCount+bottomCount+1;//coordinate 算一个 
              var colCount:number=leftCount+rightCount+1;//coordinate  算一个 

              var startRowNum:number=coordinate.row-leftCount;//topCount;//开始row编号 
              var startColNum:number=coordinate.column-topCount;//leftCount;//开始的col编号

              var startX:number=leftPixel-leftCount*Util.tile_size;
              var starty:number=topPixel-topCount*Util.tile_size;
              var zoom:number=coordinate.zoom;
              var tiles:any[]=new Array();
              console.log(rowCount+"count"+colCount);
              for(var i:number=0;i<rowCount;i++)
              {
                   for(var j:number=0;j<colCount;j++)
                   {
                        var row:number=startRowNum+i;
                        var col:number=startColNum+j;
                        var tile={
                            coordinate:new Coordinate(row,col,zoom),
                            url:zoom+"/"+row+"/"+col,
                            point:new egret.Point(startX+(i*Util.tile_size),starty+(j*Util.tile_size))
                            };
                        tiles.push(tile);
                   }
              }
              return tiles;



         }
 

 
 
		
	}
}
