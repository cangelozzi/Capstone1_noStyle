var $ = jQuery

//  ---- var related to GoogleMaps city Autocomplete list
var input = document.getElementById('autocomplete')
var options = {
  types: ['(cities)']
}
var autocomplete = new google.maps.places.Autocomplete(input, options)

// ---- Form submission and choices page shown
$('form.form').submit(function (event) {
  event.preventDefault()
    // var location = $('.query').val()
  var locationSubmitted = $('.query').val()
  var locationArray = locationSubmitted.split(',')
  var locationCity = locationArray[0]
  var locationCountry = locationArray.slice(-1)[0]
  var location = locationCity + ',' + locationCountry
  $('.searchField, .foursquare, .toTaste, .toTouch, .toVision, .toAudition').hide()
  $('.choicePage, .back').show(1000)
  var title = ''
  title = 'Which sense do you want experience about ' + location + '?'
  $('.question').append(title)

// ---- show Etsy page listings, calling Etsy API
  function showEtsy () {
    $('.touch').click(function () {
      $('.choicePage').hide()
      $('.etsy, .toTaste, .toVision, .toAudition').show(1000)
      etsyListings()
    })
    function etsyListings () {
      var apiKey = 'b1cxdz90op6vpzomscu9fr09'
      var terms = location
      var etsyURL = 'https://openapi.etsy.com/v2/listings/active.js?keywords=' +
                terms + '&limit=12&includes=Images:1&api_key=' + apiKey

      // $('.etsy').empty()
      $('<p></p>').text('Results for ' + terms).appendTo('.etsy')

      $.ajax({
        url: etsyURL,
        dataType: 'jsonp',
        success: function (data) {
          if (data.ok) {
            if (data.count > 0) {
              $('<ul>').appendTo('.etsy')
              data.results.forEach(function (item) {
                var li = $('<li>')
                li.append(
                  '<a href="' + item.url + '" target="_blank">' +
                  '<img src="' + item.Images[0].url_570xN + '"/></a>' +
                  item.title
                )
                li.appendTo('.etsy ul')
              })
            } else {
              $('<p>No results.</p>').appendTo('.etsy')
            }
          }
        }
      })
    }
  }
  showEtsy()
//
   // --- start VISION using Foursquare API
  function showPics () {
    $('.vision').click(function () {
      $('.choicePage').hide()
      $('.pics, .toTaste, .toTouch, .toAudition').show(1000)
      pics()
    })
    function pics () {
      $.getJSON('https://api.foursquare.com/v2/venues/explore?near=' + location +
              '&venuePhotos=1&section=arts,outdoors&client_id=OPA2NWMUWOEPKG121Z00AOZF53TSTBG510HABCG20Y5GZWZB&client_secret=5JJSG5341TMELPTZ5UBPI2KBSXI5KZJQIGU3ZTXJBW20EX5O&v=20161208',
      function pics (data) {
        var base = data.response.groups[0].items
        $.each(base, function (index) {
          var url = base[index].tips[0].canonicalUrl
          var photo = base[index].venue.photos.groups[0].items[0]
          var name = base[index].venue.name

          var content = '<li><a href="' + url + '" target="_blank">' + '<img src="' + photo.prefix + 'cap300' + photo.suffix + '"/></br>' + name + '</br></a></li>'
          $(content).appendTo('.pics ul')
        })
      })
    }
  }
  showPics()
  //
  // show lastFm, calling lastFm API - API key  19b8a524d7b3e2f4e8a48a323aaa7938
  function showlastFm () {
    $('.audition').click(function () {
      $('.choicePage').hide()
      $('.lastFm, .toTaste, .toVision, .toTouch').show(1000)
      audioLastFm()
    })

    function audioLastFm () {
      var url = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=' + location + '&api_key=19b8a524d7b3e2f4e8a48a323aaa7938&format=json&callback=?'
      $.getJSON(url).done(function (res) {
        $.each(res.results.albummatches.album, function (i, item) {
          var albumName = item.name
          var albumArtist = item.artist
          var albumUrl = item.url
          var albumCover = item.image[3]['#text']
          var content = '<li><a href="' + albumUrl + '" target="_blank">' + '<img src="' + albumCover + '"/></br>' + albumName + '</br>' +
                  albumArtist + '</br></a></li>'
          $(content).appendTo('.lastFm ul')
        })
      })
    }
  }
  showlastFm()
  //
  // show Foursquare, calling Foursquare API - ClientID: OPA2NWMUWOEPKG121Z00AOZF53TSTBG510HABCG20Y5GZWZB
  function showFoursquare () {
    $('.taste').click(function () {
      $('.choicePage').hide()
      $('.foursquare, .toTouch, .toVision, .toAudition').show(1000)
      fourSquare()
    })
    function fourSquare () {
      $.getJSON('https://api.foursquare.com/v2/venues/explore?near=' + location +
              '&venuePhotos=1&query=Restaurants&client_id=OPA2NWMUWOEPKG121Z00AOZF53TSTBG510HABCG20Y5GZWZB&client_secret=5JJSG5341TMELPTZ5UBPI2KBSXI5KZJQIGU3ZTXJBW20EX5O&v=20161208',
      function displayVenues (data) {
        var base = data.response.groups[0].items
        $.each(base, function (index) {
          var url = base[index].tips[0].canonicalUrl
          var text = base[index].tips[0].text
          var photo = base[index].venue.photos.groups[0].items[0]
          // var llat = base[index].venue.location.lat
          // var llng = base[index].venue.location.lng
          var name = base[index].venue.name
          var address = base[index].venue.location.address
          var city = base[index].venue.location.city
          var content = '<li><a href="' + url + '" target="_blank">' + '<img src="' + photo.prefix + 'cap300' + photo.suffix + '"/></br>' + name + '</br>' +
                  address + '</br>' + city + '</br>' + text + '</br></a></li>'
          $(content).appendTo('.foursquare ul')
        })
      })
    }
  }
  showFoursquare()

 // BACK to "Search Location"
  $('.back').on('click', function () {
    $('.choicePage, .back, .etsy, .pics, .lastFm, .foursquare, .toTaste, .toTouch, .toVision, .toAudition').hide()
    $('li').empty()
    $('.searchField').show(1000)
    $('.query').val('')
  })

// Go to Taste section
  $('.toTaste').click(function () {
    $('.choicePage, .back, .etsy, .pics, .lastFm, .searchField, .toTaste, .toTouch, .toVision, .toAudition').hide()
 // $('.foursquare').show(1000)
    showFoursquare()
  })

// Go to Vision section
  $('.toVision').click(function () {
    $('.choicePage, .back, .etsy, .foursquare, .lastFm, .searchField, .toTaste, .toTouch, .toVision, .toAudition').hide()
    $('.pics').show(1000)
  })

// Go to Touch section
  $('.toTaste').click(function () {
    $('.choicePage, .back, .foursquare, .pics, .lastFm, .searchField, .toTaste, .toTouch, .toVision, .toAudition').hide()
    $('.etsy').show(1000)
  })

// Go to Audition section
  $('.toAudition').click(function () {
    $('.choicePage, .back, .etsy, .pics, .foursquare, .searchField, .toTaste, .toTouch, .toVision, .toAudition').hide()
    $('.lastFm').show(1000)
  })
})

