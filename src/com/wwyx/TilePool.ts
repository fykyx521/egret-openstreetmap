
module com.wwyx {

	export class TilePool {
		public static MIN_POOL_SIZE:number = 256;
		public static MAX_NEW_TILES:number = 256;
		
		public pool:Array<any> = [];
		public tileClass:any;
		
		public constructor(tileClass:any){ 
			this.tileClass = tileClass;
		}
	
		public setTileClass(tileClass:any):void{
			this.tileClass = tileClass;
			this.pool = [];
		}
	
		public getTile(coordinate:Coordinate):Tile{
	    	if (this.pool.length < TilePool.MIN_POOL_SIZE) {
	    		while (this.pool.length < TilePool.MAX_NEW_TILES) {
	    			this.pool.push(new Tile());
	    		}
	    	}						
			var tile:Tile = <Tile><any> (this.pool.pop());
			tile.coordinate=coordinate;
			return tile;
		}
	
		public returnTile(tile:Tile):void{
			tile.destroy();
	    	this.pool.push(tile);
		}
		
	}
}