module com.wwyx
{
	export class Coordinate
	{
		public row:number;
	    public column:number;
	    public zoom:number;
	    
	    public constructor(row:number, column:number, zoom:number)
	    {
	        this.row = row;
	        this.column = column;
	        this.zoom = zoom;
	    }

	    public isInRect(rect:egret.Rectangle):boolean
	    {
	    	return rect.x>=this.row&&rect.y>=this.column&&this.row<=rect.width&&this.column<=rect.height;
	    }

	    public toString()
	    {
	    	return this.zoom+"/"+this.row+"/"+this.column;
	    }

	}
}