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

    colorWhite = function (el) {
        if (el.hasClass('active')){
            el.css('color', '#fff');
        }else{
            el.css('color', '#555');
        }
    };

    animate();

    $('.brands').krakatoa({
        buttons: false, 
        number: 9, 
        width: '220px', 
        height: '90px', 
        arrows: false,
        loop: true
    });

    // $('#datepicker').datepicker();
    // $('#timepicker').timepicker();

    // mailListInput = $('#mailListInput').attr('value');
    // $('#mailListInput').focusin(function(){
    //     if($(this).attr('value') == mailListInput){
    //         $(this).attr('value','');
    //     }
    // });
    // $('#mailListInput').focusout(function(){
    //     if($(this).attr('value') == ''){
    //         $(this).attr('value',mailListInput);
    //     }
    // });

});
