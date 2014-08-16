module com.wwyx
{
	export class MapExtent
	{
		public north:number;
		public south:number;
		public east:number;
		public west:number;

		public constructor(n:number=0, s:number=0, e:number=0, w:number=0)
		{
			this.north = Math.max(n, s);
			this.south = Math.min(n, s);
			this.east = Math.max(e, w);
			this.west = Math.min(e, w);
		}

		public get center():Location{   
            return new Location(this.south + (this.north - this.south) / 2, this.east + (this.west - this.east) / 2);
        }
	}
}