var STVIEWANNOTATION = function () {

    var s = {}

    //setup params
    s.currentLat = 0;
    s.currentLng = 0;
    s.currentPano = null;
    s.stElementId = "streetview";
    s.maxDistance = 1000;
    s.markers = [];
    
    s.activeMarkers = [];
    s.browserMode = null;
    s.panorama = null;

	//try to init and load streetview 
    s.loadStreetview = function(lat, lng){
        var self = this;

        //set streetview location
        if(lat == null) pos = new google.maps.LatLng(this.currentLat, this.currentLng);
        else pos = new google.maps.LatLng(lat, lng);

        //load streetview first time
        if(this.panorama == null){
            var panoramaOptions = {
              position: pos
            }

            //if panoid is set 
            if(this.currentPano != null){
                panoramaOptions = {
                    pano: this.currentPano
                }
            }

            this.panorama = new google.maps.StreetViewPanorama(document.getElementById(this.stElementId), panoramaOptions);
            
            //add events
            google.maps.event.addListener(this.panorama, 'pano_changed', function() {
                self.currentPano = self.panorama.getPano();
                self.showMarkers();
            });

            google.maps.event.addListener(this.panorama, 'pov_changed', function() {
                self.reDrawMarkers();
            });

            google.maps.event.addListener(this.panorama, 'zoom_changed', function() {
                self.reDrawMarkers();
            });

        }

        this.findClosestView(pos);

    }

    s.findClosestView = function(pos){
        var self = this;
        var gService = new google.maps.StreetViewService();
        gService.getPanoramaByLocation(pos, this.maxDistance, function (data, status){
            if (status == google.maps.StreetViewStatus.OK) {
                self.panorama.setPano(data.location.pano);
                self.panorama.setPov({heading: 0, zoom: 0, pitch: 0});
                self.showMarkers();
            }
        });
    }

    s.showMarkers = function(){

        //remove all active markers
        if(this.activeMarkers.length>0){
            for(var i = 0;i<this.activeMarkers.length;i++){
                var m = this.activeMarkers[i];
                m.obj.parentNode.removeChild(m.obj);
            }
            this.activeMarkers = [];
        }
        //$('.pano-show-marker').remove();
        for(var i = 0;i<this.markers.length;i++){
            var m = this.markers[i];
            if(this.currentPano == m.panoid){
                m.obj = document.createElement('div');
                m.obj.style.position = 'absolute';
                m.obj.style.zIndex = (i+2); 
                m.obj.innerHTML = m.html;
                document.getElementById(this.stElementId).appendChild(m.obj)
                this.activeMarkers.push(m);
            }
        }
        this.reDrawMarkers();
    }

    s.reDrawMarkers = function(){
        for(var i = 0;i<this.activeMarkers.length;i++){
            var m = this.activeMarkers[i];
            var pos = this.angle2Pixel(parseFloat(m.heading), parseFloat(m.pitch));
            var w = document.getElementById(this.stElementId).offsetWidth;
            if(pos.x == w || pos.x == -w){
                m.obj.style.left = pos.x  + "px";
                m.obj.style.top = pos.y + "px";
            }else{
                m.obj.style.left = (pos.x - m.obj.offsetWidth/2) + "px";
                m.obj.style.top = (pos.y - m.obj.offsetHeight/2) + "px";
            }
        }
    }

    //get field of view
    s.getFov = function(zoom) {

        if(this.browserMode == null){
            //check if browser supports canvas
            var canvas = document.createElement("canvas");
            this.browserMode = [180, 90, 45, 22.5, 11.25]; //html image mode
            if(canvas.getContext || canvas.getContext("2d")){
            	this.browserMode = [127, 90, 53, 28, 14]; //canvas
            }
        }

        var floor = this.browserMode[Math.floor(zoom)];
        var ceil = this.browserMode[Math.ceil(zoom)];
        return floor + (ceil - floor) * (zoom - Math.floor(zoom))
    }



    s.limitPoint = function(current, pov, val, fov) {
        if(pov - fov / 2 > current) val = -1;
        if(pov + fov / 2 < current) val = 1;
        return val;
    }


    s.angle2Pixel = function(heading, pitch) {
        var pov = this.panorama.getPov();

        //normalize heading
        pov.heading = 360*(pov.heading/360-Math.floor((pov.heading+180)/360));
        
        //get streetview width, height and fov
        var w = document.getElementById(this.stElementId).offsetWidth;
        var h = document.getElementById(this.stElementId).offsetHeight;
        var fov = this.getFov(this.panorama.getZoom());
        
        //convert angle to point
        var pix = this.angle2Point(-pitch, heading, -pov.pitch, pov.heading, fov);

        //limit to edges if not visible
        pix.x = this.limitPoint(heading, pov.heading, pix.x, fov);
        pix.y = this.limitPoint(-pitch, -pov.pitch, pix.y, fov);

        //calculate exact position
        pix.x = pix.x * w;
        pix.y = pix.y * w - (w - h) / 2;

        return pix;
    }

    s.angle2Point = function(pitch, heading, povPitch, povHeading, fov) {
        var ret = {};
        
        //convert to radian
        povPitch = povPitch / 180 * Math.PI;
        povHeading = povHeading / 180 * Math.PI;
        pitch = pitch / 180 * Math.PI;
        heading = heading/ 180 * Math.PI;
        fov = 1 / Math.tan(fov / 180 * Math.PI / 2) / 2;    
        
        //calculate x/y 
        var sinCos = Math.sin(povPitch) * Math.sin(pitch) + Math.cos(povPitch) * Math.cos(pitch) * Math.cos(heading - povHeading);
        ret.x = Math.cos(pitch) * Math.sin(heading - povHeading) / sinCos * fov + .5;
        ret.y = (Math.cos(povPitch) * Math.sin(pitch) - Math.sin(povPitch) * Math.cos(pitch) * Math.cos(heading - povHeading)) / sinCos * fov + .5;
        return ret; 
    }


    return s;

};


