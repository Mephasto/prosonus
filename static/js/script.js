/*
    Author: Mephasto
*/
$(document).ready(function() {
    'use strict';

    var mailListInput, animate, changeColor, colorWhite, elem, hiperlinks, fps = 60;

    elem = $('#nav');
    animate = function () {
        elem.css('background-position', Math.floor(Math.random()*1920) + 'px ' + Math.floor(Math.random()*1284) + 'px' );
        setTimeout(function() {
            requestAnimationFrame(animate, elem);
        }, 1000 / fps);
    };

    
    changeColor = function (el) {
        //hiperlinks.css('background-color', '#'+Math.floor(Math.random()*16777215).toString(16));
        el.css('color', '#'+ Math.floor(777215 + Math.random()*16000000).toString(16));
    };
    colorWhite = function (el) {
        if (el.hasClass('active')){
            el.css('color', '#fff');
        }else{
            el.css('color', '#555');
        }
    };

    $('#nav ul li a').hover(function(){
        changeColor($(this));
    }, function(){
        colorWhite($(this));
    });
    $('#nav ul li a').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', changeColor);
    animate();

    $('#nav').css('background-position', '100px');
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
