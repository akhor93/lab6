'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('.project a').click(addProjectDetails);

	$('#colorBtn').click(randomizeColors);
}

/*
 * Make an AJAX call to retrieve project details and add it in
 */
function addProjectDetails(e) {
	// Prevent following the link
	e.preventDefault();

	// Get the div ID, e.g., "project3"
	var projectID = $(this).closest('.project').attr('id');
	// get rid of 'project' from the front of the id 'project3'
	var idNumber = projectID.substr('project'.length);

	var url = '/project/' + idNumber;
	console.log(url);
	$.get(url, appendProjectInfo);

	var query = $('#project' + idNumber + ' .project_title').text();
	console.log(query);
	$.ajax({
      url: 'http://ws.spotify.com/search/1/track.json',
      dataType: 'json',
      data: {q: query},
      timeout: 30000,
      beforeSend: function (xhr) {
        self._activeQueryXHR = xhr;
      },
      complete: function (xhr, textStatus) {
        if (self._activeQueryXHR === xhr)
          self._activeQueryXHR = null;
      },
      success: function (data, textStatus, xhr) {
        appendTopSongs(data, 10,idNumber);
      }
    });

	console.log("User clicked on project " + idNumber);
}

function appendTopSongs(data, numSongs, projectID) {
	console.log(data.tracks)
	if(data.tracks.length != 0) {
		var songHTML = '';
		songHTML += '<h2>Songs with Similar Title to ' + $('#project' + projectID + ' .project_title').text() + '</h2>';
		songHTML += '<table class="table table-striped">';
		songHTML += '<th><tr><td>Title</td><td>Artist</td></tr></th>';
		for(var i = 0; i < numSongs; i++) {
			songHTML += '<tr>';
			songHTML += '<td>' + data.tracks[i].name + '</td>';
			songHTML += '<td>' + data.tracks[i].artists[0].name + '</td>';
			songHTML += '</tr>';
		}
		songHTML += '</table>';
		console.log(projectID);
		$('#project' + projectID + ' .songs').html(songHTML);
	}
	else {
		$('#project' + projectID + ' .songs').html("<h2>No Songs With Similar Title Found on Spotify</h2>");
	}
}

function appendProjectInfo(result) {
	var html = '';
	html += '<div class="project_header">' + result.date + '</div>';
	html += '<div><img class="detailsImage" src="' + result.image + '"></div>';
	html += '<div>' + result.summary + '</div>';
	$('#project' + result.id + ' .details').html(html);
}

/*
 * Make an AJAX call to retrieve a color palette for the site
 * and apply it
 */
function randomizeColors(e) {
	console.log("User clicked on color button");
	$.get("/palette", changeSiteStyle);
}

function changeSiteStyle(result) {
	var colors = result.colors.hex;
	console.log(colors);
	$('body').css('background-color', colors[0]);
	$('.thumbnail').css('background-color', colors[1]);
	$('h1, h2, h3, h4, h5, h5').css('color', colors[2]);
	$('p').css('color', colors[3]);
	$('.project img').css('opacity', .75);
}