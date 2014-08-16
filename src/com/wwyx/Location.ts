
module com.wwyx {

	export class Location{
	    public static MAX_LAT:number = 84;
	    public static MIN_LAT:number = -Location.MAX_LAT;
	    public static MAX_LON:number = 180;
	    public static MIN_LON:number = -Location.MAX_LON;
	    
	    // Latitude, longitude, _IN DEGREES_.
	    public lat:number;
	    public lon:number;
	
		

	    public constructor(lat:number, lon:number){
	        this.lat = lat;
	        this.lon = lon;
	    }
	    
	    public equals(loc:Location):boolean{
	        return loc && loc.lat == this.lat && loc.lon == this.lon;
	    }
	    
	    public clone():Location{
	        return new Location(this.lat, this.lon);
	    }

        /**
         * This function normalizes latitude and longitude values to a sensible range
         * (±84°N, ±180°E), and returns a new Location instance.
         */
        public normalize():Location{
            var loc:Location = this.clone();
            loc.lat = Math.max(Location.MIN_LAT, Math.min(Location.MAX_LAT, loc.lat));
            while (loc.lon > 180) loc.lon -= 360;
            while (loc.lon < -180) loc.lon += 360;
            return loc;
        }

	    public toString(precision:number=5):string{
	        return [this.lat.toFixed(precision), this.lon.toFixed(precision)].join(',');
	    }
	}
}