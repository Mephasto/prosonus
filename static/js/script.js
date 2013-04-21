/*
    Author: YOUR NAME HERE
*/
$(document).ready(function() {
    console.log('asdasd');
    'use strict';

    var mailListInput, animate, changeColor, elem, fps = 60;

    elem = $('header h2');
    animate = function () {
        elem.css('background-position', Math.floor(Math.random()*255) + 'px ' + Math.floor(Math.random()*255) + 'px' );
        setTimeout(function() {
            requestAnimationFrame(animate, elem);
        }, 1000 / fps);
    };
    changeColor = function () {
        elem.css('background-color', '#'+Math.floor(Math.random()*16777215).toString(16));
        elem.css('color', '#'+Math.floor(Math.random()*16777215).toString(16));
    };

    elem.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', changeColor);
    changeColor();
    animate();


    $('#datepicker').datepicker();
    $('#timepicker').timepicker();

    mailListInput = $('#mailListInput').attr('value');
    $('#mailListInput').focusin(function(){
        if($(this).attr('value') == mailListInput){
            $(this).attr('value','');
        }
    });
    $('#mailListInput').focusout(function(){
        if($(this).attr('value') == ''){
            $(this).attr('value',mailListInput);
        }
    });

});
