class ImageHelper{
    constructor(){
        let self = this;
        this.resizeImage = function (settings) {
            var file = settings.file;
            var maxSize = settings.maxSize;
            var reader = new FileReader();
            var image = new Image();
            var canvas = document.createElement('canvas');
            var dataURItoBlob = function (dataURI) {
                var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ? atob(dataURI.split(',')[1]) : unescape(dataURI.split(',')[1]);
                var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var max = bytes.length;
                var ia = new Uint8Array(max);
                for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
                return new Blob([ia], { type: mime });
            };
            self.resize = function () {
                var width = image.width;
                var height = image.height;

		        canvas.width = 256;
                canvas.height = 256;
		        canvas.getContext('2d').drawImage(image, 0, 0, 256, 256);
		
                var dataUrl = canvas.toDataURL('image/jpeg');
                return dataURItoBlob(dataUrl);
            };
            return new Promise(function (ok, no) {
            if (!file.type.match(/image.*/)) {
                no(new Error("Not an image"));
                return;
            }
            reader.onload = function (readerEvent) {
                image.onload = function () { return ok(self.resize()); };
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
            });
        };
    }
    load(input, fileName, onFinish){
        let self = this;
	    this.resizeImage({
		    file: input.files[0],
		    maxSize: 500
	        }).then(function (resizedImage) {
			    var reader = new FileReader();
			    var base64data="";
                reader.readAsDataURL(resizedImage); 
                reader.onloadend = function() {
				    base64data = reader.result;  
                    let file = self.dataURLtoFile(base64data, fileName);
                    onFinish(file, base64data);
                };
	    }).catch(function (err) {
		    alert(err);
	    });
    }


    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }
    toBase64(img, callbeck) {
        let self = this;
        fetch(img.src)
            .then((res) => res.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    /*console.log(reader.result);*/
                    /*const base64 = getBase64StringFromDataURL(reader.result);*/
                    let base64data = reader.result;  
                    let file = self.dataURLtoFile(base64data, "test");
                    callbeck(file, base64data);
                };
                reader.readAsDataURL(blob);
        });
      }
}
