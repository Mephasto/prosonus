$(document).ready(function(){
    var json_Album_URI = "https://picasaweb.google.com/data/feed/base/"
        + "user/"       +   "vidriorock"
        + "?alt="       +   "json"
        + "&kind="      +   "album"
        + "&hl="        +   "en_US"
        + "&fields="    +   "entry(media:group,id)"
        + "&thumbsize=" +   50;
 
    $.getJSON(json_Album_URI, function(data){
        $.each(data.feed.entry, function(i,item){
            //Thumbnail URL
            var album_Title = item.media$group.media$title.$t;
            $.each(item.media$group.media$thumbnail, function(i,item){
                var album_thumb_URL = item.url;
                $('#photoalbums').append('<li>' + album_Title + '</li>');
            });
            //Album Title
            //$('#images').append("Album Title: " + album_Title + '<br />');
            //Album Description
            var album_Description = item.media$group.media$description.$t;
            //$('#images').append("Album Description: " + album_Description + '<br />');
            //Album ID
            var album_ID = item.id.$t;
                //Get Numerical ID from URL
            album_ID = album_ID.split('/')[9].split('?')[0];
            //$('#images').append("AlbumID: " + album_ID + '<br /><br />');
 
            var json_Photo_URI = "https://picasaweb.google.com/data/feed/base/"
                + "user/"       +   "vidriorock"
                + "/albumid/"   +   album_ID
                + "?alt="       +   "json"
                + "&kind="      +   "photo"
                + "&hl="        +   "en_US"
                + "&fields="    +   "entry(media:group)"
                + "&thumbsize=" +   104;
 
 
            $.ajax({
                type: 'GET',
                url: json_Photo_URI,
                success : function(data){
                    $.each(data.feed.entry, function(i,item){
                        //Photo URL
                        var photo_URL = [];
                        $.each(item.media$group.media$content, function(i,item){
                            // FOTO GRANDE ACA <--
                            if ( ! photo_URL[i]) {
                                photo_URL[i] = [];  
                            }
                            photo_URL[i]['big'] = item.url;
                        });
                        //Thumbnail URL
                        $.each(item.media$group.media$thumbnail, function(i,item){
                            photo_URL[i]['small'] = item.url;
                            $('#images').append('<a href="' + photo_URL[i]['big'] + '" title="Fotos" data-gallery="gallery"><img src="' + photo_URL[i]['small'] + '" /></a >');
                        });
                        //Photo Title
                        var photo_Title = item.media$group.media$title.$t;
                        //$('#images').append("Image Photo_Title: " + photo_Title + '<br />');
                        //Photo Description
                        var photo_Description = item.media$group.media$description.$t;
                        //$('#images').append("Image Photo Description: " + photo_Description + '<br /><br />');
                    });
                },
                dataType: 'json',
                async: false
            });       
        
        });
    });
});