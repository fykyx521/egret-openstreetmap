

    class GoogleMapProvider extends com.wwyx.OpenStreetMapProvider
	{
		/*
		private static baseUrl:string="http://tile.openstreetmap.org/";
		public getTileUrl(row:number,col:number,zoom:number):string
		{
			var url:string=zoom+"/"+row+"/"+col;
			return GoogleMapProvider.baseUrl+url+".png";
		}
	*/

		
			public getTileUrl(row:number,col:number,zoom:number):string
			{
					
					return "http://mt"+(row%4)+".google.cn/vt/hl=zh-CN&gl=cn&x="+row+"&y="+col+"&z="+zoom+"&s=Galil";
			}
		
	}
