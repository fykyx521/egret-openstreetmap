module com.wwyx
{

	export class OpenStreetMapProvider implements com.wwyx.IMapProvider
	{
		private static baseUrl:string="http://tile.openstreetmap.org/";
		public getTileUrl(row:number,col:number,zoom:number):string
		{
			var url:string=zoom+"/"+row+"/"+col;
			return OpenStreetMapProvider.baseUrl+url+".png";
		}
	}
}