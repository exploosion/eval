const noPlanMessage = 'No required development from questions above.';
var test;
var length;
var index;
var tempIndex;
var loopCount;
var qObject;
var qArray;
var tempArray;
var requireImprovement = false;
var split;
var empTotal = 0;
var empScore = 0;
var proTotal = 0;
var proScore = 0.0;
var supTotal = 0.0;
var supScore = 0.0;

//Function to prevent non digits and only allow one decimal in field
function preventAlpha()
{
    var val = $(this).val();
    if(isNaN(val))
	{
         val = val.replace(/[^0-9\.]/g,'');
         if(val.split('.').length>2) 
             val =val.replace(/\.+$/,"");
    }
    $(this).val(val); 
}

//Function to resize textareas
function resize (x)
{
	$(x).height(0);
	if(x.scrollHeight == 0)
	{
		$(x).height('18px');
	}
	else
	{
		$(x).height(x.scrollHeight);
	}
		
}

function waitForElement (selector, callback, maxTimes = false)
{
	if (maxTimes != false)
	{
		maxTimes--;
	}
	console.log('Attempt');
	if($(selector).length)
	{
		callback();
		console.log('Finished');
	}
	else
	{
		if (maxTimes === false || maxTimes > 0)
		{
			setTimeout(function()
			{
				console.log('Waiting');
				waitForElement(selector, callback, maxTimes);
			}, 100);
		}
		else
		{
			console.log('Max attempts reached, giving up.');
		}
	}
}

function requireHidden (condition, target)
{
		$('tr').find('div[class*=' + target + ']').next().remove();
		$('tr').find('div[id=' + target + ']').next().remove();
		$('tr').find('div[hidetype=' + target + ']').next().remove();
	
	if(condition)
	{
		$('tr').has('div[class*=' + target + ']').find('input').prop('required', true);
		$('tr').has('div[class*=' + target + ']').find('select').prop('required', true);
		$('tr').find('div[class*=' + target + ']').after('<div class=\'redAsterisk\' style=\'color : red; display : inline\'>*</div>');
		$('tr').has('div[id=' + target + ']').find('input').prop('required', true);
		$('tr').has('div[id=' + target + ']').find('select').prop('required', true);
		$('tr').find('div[id=' + target + ']').after('<div class=\'redAsterisk\' style=\'color : red; display : inline\'>*</div>');
		$('tr').has('div[hideType=' + target + ']').find('input').prop('required', true);
		$('tr').has('div[hideType=' + target + ']').find('select').prop('required', true);
		$('tr').find('div[hideType=' + target + ']').after('<div class=\'redAsterisk\' style=\'color : red; display : inline\'>*</div>');
	}
	else
	{
		$('tr').has('div[class*=' + target + ']').find('input').prop('required', false);
		$('tr').has('div[class*=' + target + ']').find('select').prop('required', false);
		$('tr').has('div[id=' + target + ']').find('input').prop('required', false);
		$('tr').has('div[id=' + target + ']').find('select').prop('required', false);
		$('tr').has('div[hidetype=' + target + ']').find('input').prop('required', false);
		$('tr').has('div[hidetype=' + target + ']').find('select').prop('required', false);
	}
}

function requireHiddenNotes (condition, target)
{
		if(condition)
		{
			$('tr').has('div[class*=' + target + ']').next().find('textarea').prop('required', true);
			$('tr').has('div[id=' + target + ']').next().find('textarea').prop('required', true);
			$('tr').has('div[hidetype=' + target + ']').next().find('textarea').prop('required', true);
		}
		else
		{
			$('tr').has('div[class*=' + target + ']').next().find('textarea').prop('required', false);
			$('tr').has('div[id=' + target + ']').next().find('textarea').prop('required', false);
			$('tr').has('div[hidetype=' + target + ']').next().find('textarea').prop('required', false);
		}
}

function hideShow ()
{
	if($('tr').has('div[id=staffType]').find('input').eq(0).prop('checked') || $('tr').has('div[id=staffType]').find('input').eq(2).prop('checked'))
	{
		$('td').has('div[hidetype=clinical], span[hidetype=clinical]').show();
		requireHidden(true, 'clinical');
		$('input[id=refreshReport]').trigger('click');
		$('tr').has('div[class=calc]').trigger('change');
	}
	else
	{
		$('td').has('div[hidetype=clinical], span[hidetype=clinical]').hide();
		requireHidden(false, 'clinical');
		$('tr').has('span[hidetype=clinical][type=answer]').find('input').val('');
	}

	if($('tr').has('div[id=staffType]').find('input').eq(0).prop('checked') || $('tr').has('div[id=staffType]').find('input').eq(1).prop('checked'))
	{
		$('td').has('span[hidetype=sup], hr[hidetype=sup], div[hidetype=sup]').show();
		requireHidden(true, 'sup');
		$('tr').has('span[class=hiddenHeader]').find('input').prop('checked', true);
		$('tr').has('span[id=in3]').find('input').val(supScore + ' / 5');
	}
	else
	{
		$('td').has('span[hidetype=sup], hr[hidetype=sup], div[hidetype=sup]').hide();
		requireHidden(false, 'sup');
		$('tr').has('span[class=hiddenHeader]').find('input').prop('checked', false);
		$('tr').has('span[hidetype=sup][type=answer]').find('input').val('');
	}
}

function customCallBack ()
{
	console.log('It\'s here!');
	length = $('div[class=Q]').length;
	qObject = [length];
	qArray = [length];
	tempArray = [length];

	//Set all answer values to 0 on page load
	$('input[name*=_calc]').each(function()
	{
		if(!$(this).val())
		{
			$(this).val('0');
		}
	});

	//On page load, set Dress code question values to be more readable.
	$('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).val('No (details below)');
	$('tr').has('div[id=dressCode]').find('input[type=button]').eq(1).val('Yes');

	//On page load, Load Yes No question into numeric push button
	/*if($('tr').has('div[id=yesNo]').find('input[type=button]').eq(0).css('background-color') == 'rgb(204, 204, 204)')
	{
		$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('5');
		if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).css('background-color') == 'rgb(255, 255, 255)')
		{
			$('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).trigger('click');
		}
	}
	else if ($('tr').has('div[id=yesNo]').find('input[type=button]').eq(1).css('background-color') == 'rgb(204, 204, 204)')
	{
		$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('1');
		if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).css('background-color') == 'rgb(255, 255, 255)')
		{
			$('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).trigger('click');
		}
	}
	else
	{
		$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('0');
		if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).css('background-color') == 'rgb(204, 204, 204)')
		{
			$('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).trigger('click');
		}
		if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).css('background-color') == 'rgb(204, 204, 204)')
		{
			$('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).trigger('click');
		}
	}
	$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('');*/

	//Event handler to drive Yes No question
	/*$('tr').has('div[id=yesNo]').find('input[type=button]').click(function()
	{
		if($('tr').has('div[id=yesNo]').find('input[type=button]').eq(0).css('background-color') == 'rgb(204, 204, 204)')
		{
			$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('5');
			if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).css('background-color') == 'rgb(255, 255, 255)')
			{
				$('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).trigger('click');
			}
		}
		else if ($('tr').has('div[id=yesNo]').find('input[type=button]').eq(1).css('background-color') == 'rgb(204, 204, 204)')
		{
			$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('1');
			if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).css('background-color') == 'rgb(255, 255, 255)')
			{
				$('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).trigger('click');
			}
		}
		else
		{
			$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('0');
			if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).css('background-color') == 'rgb(204, 204, 204)')
			{
				$('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).trigger('click');
			}
			if($('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).css('background-color') == 'rgb(204, 204, 204)')
			{
				$('tr').has('div[id=dressCode]').find('input[type=button]').eq(0).trigger('click');
			}
		}
		$('tr').has('div[id=dressCode]').find('input[name*=_calc]').val('');
	});*/

	//Hide the numeric push button version of Dress Code Adherence question
	//$('td').has('div[id=dressCode]').hide();

	//Hide unneeded buttons for dress code question
	$('tr').has('div[id=dressCode]').find('input[type=button]').eq(4).hide();
	$('tr').has('div[id=dressCode]').find('input[type=button]').eq(3).hide();
	$('tr').has('div[id=dressCode]').find('input[type=button]').eq(2).hide();

	//Events to drive textarea resizes
	setTimeout(function()
	{
		/*$('tr').has('div[id=autoGenerate]').next().find('textarea').change(function()
		{
			resize(this);
		});*/
		$('.plans').keyup(function()
		{
			resize(this);
		});
		$('tr').has('div[id=additionalAreas]').next().find('textarea').keyup(function()
		{
			resize(this);
		});
	}, 0);

	//Load Question titles into qArray and qObject
	for(loopCount = 0; loopCount < $('div[class=Q]').length; loopCount++)
	{
		qObject[loopCount] = {q:$('div[class=Q]').eq(loopCount).html(), date:'', plan:'', val:0, needed:false};
		if($('input[name*=_calc]').eq(loopCount).val() && $('input[name*=_calc]').eq(loopCount).val() != '0')
		{
			qObject[loopCount].val = $('input[name*=_calc]').eq(loopCount).val();
		}
		qArray[loopCount] = qObject[loopCount].q;
	}
	
	//Create No Required Development From Qustions Above div
	$('div[id=plan]').html($('div[id=plan]').html() + ('<div id=\'noPlan\'>' + noPlanMessage + '</div>'));

	//Create improvement plan fields
	for(loopCount = 0; loopCount < length; loopCount++)
	{
		$('div[id=plan]').html($('div[id=plan]').html() + ( '<div class=\'areas\' id=\'area' + loopCount + '\'>' + '<label id-=\'' + 'label' + loopCount + '\'><b>Improvement Area: </b></label>' + qObject[loopCount].q + '<br>') + ('<label><b>Target Date:</b></label><br><input class=\'dates\'id=\'' + 'date' + loopCount + '\' type=\'date\'></input><br>') + ('<label><b>Plan:</b></label><br><textarea class=\'plans\' id=\'' + 'plan' + loopCount + '\' cols=\'71\'></textarea><br><br>' + '</div>'));
	}

	//Events to load temp values into qObject
	$('.dates').change(function()
	{
		tempIndex = this.id.slice(4);
		
		qObject[tempIndex].date = $('#date' + tempIndex ).val();
	});
	$('.plans').change(function()
	{
		tempIndex = this.id.slice(4);
		
		qObject[tempIndex].plan = $('#plan' + tempIndex ).val();
	});

	//Load into improvement plan
	if($('tr').has('div[id=victim]').next().find('textarea').val() != '' && $('tr').has('div[id=victim]').next().find('textarea').val() != noPlanMessage)
	{
		requireImprovement = true;
		split = $('tr').has('div[id=victim]').next().find('textarea').val().split('\n');
		split = $.grep(split,function(value)
		{
			return value != '';
		});
		for(loopCount = 0, index = 0; loopCount < length; loopCount++)
		{
			if(qObject[loopCount].q == split[index].slice(18))
			{
				qObject[loopCount].date = split[index+1].slice(13);
				qObject[loopCount].plan = split[index+2].slice(6);
				qObject[loopCount].needed = true;
				if(index + 3 < split.length)
				{
					index = index + 3;
				}
			}
		}
		for(loopCount = 0; loopCount < length; loopCount++)
		{
			if(qObject[loopCount].needed == true)
			{
				$('#area' + loopCount).show();
				$('#date' + loopCount).val(qObject[loopCount].date);
				$('#plan' + loopCount).val(qObject[loopCount].plan);
				$('#date' + loopCount).prop('required', true);
				$('#plan' + loopCount).prop('required', true);
				resize($('#plan' + loopCount)[0]);
			}
		}
	}
	else if ($('tr').has('div[id=victim]').next().find('textarea').val() == noPlanMessage)
	{
		requireImprovement = false;
	}

	//On page load hide temp improvement plan fields that are not needed at the moment
	for(loopCount = 0; loopCount < length; loopCount++)
	{
		if(qObject[loopCount].needed == false)
		{
			$('#area' + loopCount).hide();
		}
	}

	//On page load if no areas are set to 1 or 2, display message, else display areas requiring improvement
	/*if($('tr').has('div[id=autoGenerate]').next().find('textarea').val() == '')
	{
		$('tr').has('div[id=autoGenerate]').next().find('textarea').val('Above areas meeting/exceeding expectations');
		$('td').has('div[id=plan]').hide();
	}
	else
	{
		$('td').has('div[id=plan]').show();
	}
	$('tr').has('div[id=autoGenerate]').next().find('textarea').trigger('change');
	setTimeout(resize($('tr').has('div[id=autoGenerate]').next().find('textarea')[0]), 0);*/
	
	//Some initial housekeeping
	$('#credibleBI').hide();
	$('tr').has('div[class*=nlcbBr]').find('input[type=checkbox]').before('<br>');
	$('tr').find('div[class*=nlcbBr]').css('display', 'inline');
	$('tr').has('span[class*=nlcbBr]').find('input[type=checkbox]').before('<br>');
	$('tr').find('span[class*=nlcbBr]').css('display', 'inline');
	$('hr[class=line]').css({'margin-top':'-10px', 'width':'100em'});
	$('tr').find('div[class=Q]').css('display', 'inline');
	$('tr').has('span[class=hiddenHeader]').find('input').hide();
	$('tr').has('div[class*=hiddenChecks]').find('input').hide();
	$('td').has('div[id=victim]').hide();
	$('tr').has('div[id=victim]').next().hide();
	$('u').contents().unwrap();
	$('input[name=Complete]').prop('disabled', false);
	$('tr').has('div[class*=uneditable]').find('input').prop('readonly', true);
	$('tr').has('div[class*=uneditable]').next().find('textarea').prop('readonly', true);
	$('tr').has('span[class*=uneditable]').find('input').prop('readonly', true);
	$('tr').has('span[class*=uneditable]').next().find('textarea').prop('readonly', true);
	$('tr').has('div[id=success]').find('input').hide();
	if(!$('tr').has('div[id=success]').find('input').prop('checked'))
	{
		$('tr').has('div[id=success]').find('input').trigger('click');
	}
	requireHiddenNotes(true, 'success');

	//On page load, hide/show clincal/sup questions
	hideShow();

	//Event to hide/show clinical/sup questions when staffType changed
	$('tr').has('div[id=staffType]').find('input').change(hideShow);
	document.querySelector('#staffType').closest('table').querySelector('input').addEventListener('mouseleave', hideShow);

	//Setting default parameters for error and late documentaion rates
	$('tr').has('div[id=expectedErrorRate]').find('input').val('5.0%');
	$('tr').has('div[id=expectedLateDocumentationRate]').find('input').val('5.0%');

	//On page load set clinical scores if fields are filed in
	if($('tr').has('div[id=averageRevenue]').find('input').val() && $('tr').has('div[id=expectedRevenue]').find('input').val())
	{
		$('tr').has('span[id=revenueScore]').find('input').val((($('tr').has('div[id=averageRevenue]').find('input').val() / $('tr').has('div[id=expectedRevenue]').find('input').val()) * 100).toFixed(1) + '%');
	}
	else
	{
		$('tr').has('span[id=revenueScore]').find('input').val('');
	}
	if($('tr').has('div[id=averageBillableHours]').find('input').val() && $('tr').has('div[id=expectedBillableHours]').find('input').val())
	{
		$('tr').has('span[id=billableHoursScore]').find('input').val((($('tr').has('div[id=averageBillableHours]').find('input').val() / $('tr').has('div[id=expectedBillableHours]').find('input').val()) * 100).toFixed(1) + '%');
	}
	else
	{
		$('tr').has('span[id=billableHoursScore]').find('input').val('');
	}
	if($('tr').has('div[id=averageErrorRate]').find('input').val())
	{
		$('tr').has('span[id=errorRateScore]').find('input').val(parseFloat($('tr').has('div[id=averageErrorRate]').find('input').val()).toFixed(1) + '%');
		if(parseFloat($('tr').has('div[id=averageErrorRate]').find('input').val()) > parseFloat($('tr').has('div[id=expectedErrorRate]').find('input').val().slice(0, $('tr').has('div[id=expectedErrorRate]').find('input').val().length - 1)))
		{
			$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'red');
			$('tr').has('span[id=errorRateScore]').find('input').css('color', 'red');
		}
		else
		{
			$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'black');
			$('tr').has('span[id=errorRateScore]').find('input').css('color', 'black');
		}
	}
	else
	{
		$('tr').has('span[id=errorRateScore]').find('input').val();
	}
	if($('tr').has('div[id=averageLateDocumentationRate]').find('input').val())
	{
		$('tr').has('span[id=lateDocumentationRateScore]').find('input').val(parseFloat($('tr').has('div[id=averageLateDocumentationRate]').find('input').val()).toFixed(1) + '%');
		if(parseFloat($('tr').has('div[id=averageLateDocumentationRate]').find('input').val()) > parseFloat($('tr').has('div[id=expectedLateDocumentationRate]').find('input').val().slice(0, $('tr').has('div[id=expectedLateDocumentationRate]').find('input').val().length - 1)))
		{
			$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'red');
			$('tr').has('span[id=lateDocumentationRateScore]').find('input').css('color', 'red');
		}
		else
		{
			$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'black');
			$('tr').has('span[id=lateDocumentationRateScore]').find('input').css('color', 'black');
		}
	}
	else
	{
		$('tr').has('span[id=lateDocumentationRateScore]').find('input').val()
	}
	if($('tr').has('div[id=averageCustomMetric]').find('input').val() && $('tr').has('div[id=expectedCustomMetric]').find('input').val())
	{
		$('tr').has('div[id=customMetricScore]').find('input').val((($('tr').has('div[id=averageCustomMetric]').find('input').val() / $('tr').has('div[id=expectedCustomMetric]').find('input').val()) * 100).toFixed(1) + '%');
	}
	else
	{
		$('tr').has('div[id=customMetricScore]').find('input').val('');
	}

	//Event handler for calculating clinical fields and custom metric field
	$('tr').has('div[class=calc]').change(function()
	{
		if($('tr').has('div[id=averageRevenue]').find('input').val() && $('tr').has('div[id=expectedRevenue]').find('input').val())
		{
			$('tr').has('span[id=revenueScore]').find('input').val((($('tr').has('div[id=averageRevenue]').find('input').val() / $('tr').has('div[id=expectedRevenue]').find('input').val()) * 100).toFixed(1) + '%');
		}
		else
		{
			$('tr').has('span[id=revenueScore]').find('input').val('');
		}
		if($('tr').has('div[id=averageBillableHours]').find('input').val() && $('tr').has('div[id=expectedBillableHours]').find('input').val())
		{
			$('tr').has('span[id=billableHoursScore]').find('input').val((($('tr').has('div[id=averageBillableHours]').find('input').val() / $('tr').has('div[id=expectedBillableHours]').find('input').val()) * 100).toFixed(1) + '%');
		}
		else
		{
			$('tr').has('span[id=billableHoursScore]').find('input').val('');
		}
		if($('tr').has('div[id=averageErrorRate]').find('input').val())
		{
			$('tr').has('span[id=errorRateScore]').find('input').val(parseFloat($('tr').has('div[id=averageErrorRate]').find('input').val()).toFixed(1) + '%');
			if(parseFloat($('tr').has('div[id=averageErrorRate]').find('input').val()) > parseFloat($('tr').has('div[id=expectedErrorRate]').find('input').val().slice(0, $('tr').has('div[id=expectedErrorRate]').find('input').val().length - 1)))
			{
				$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'red');
				$('tr').has('span[id=errorRateScore]').find('input').css('color', 'red');
			}
			else
			{
				$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'black');
				$('tr').has('span[id=errorRateScore]').find('input').css('color', 'black');
			}
		}
		else
		{
			$('tr').has('span[id=errorRateScore]').find('input').val();
		}
		if($('tr').has('div[id=averageLateDocumentationRate]').find('input').val())
		{
			$('tr').has('span[id=lateDocumentationRateScore]').find('input').val(parseFloat($('tr').has('div[id=averageLateDocumentationRate]').find('input').val()).toFixed(1) + '%');
			if(parseFloat($('tr').has('div[id=averageLateDocumentationRate]').find('input').val()) > parseFloat($('tr').has('div[id=expectedLateDocumentationRate]').find('input').val().slice(0, $('tr').has('div[id=expectedLateDocumentationRate]').find('input').val().length - 1)))
			{
				$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'red');
				$('tr').has('span[id=lateDocumentationRateScore]').find('input').css('color', 'red');
			}
			else
			{
				$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'black');
				$('tr').has('span[id=lateDocumentationRateScore]').find('input').css('color', 'black');
			}
		}
		else
		{
			$('tr').has('span[id=lateDocumentationRateScore]').find('input').val()
		}
		if($('tr').has('div[id=averageCustomMetric]').find('input').val() && $('tr').has('div[id=expectedCustomMetric]').find('input').val())
		{
			$('tr').has('div[id=customMetricScore]').find('input').val((($('tr').has('div[id=averageCustomMetric]').find('input').val() / $('tr').has('div[id=expectedCustomMetric]').find('input').val()) * 100).toFixed(1) + '%');
		}
		else
		{
			$('tr').has('div[id=customMetricScore]').find('input').val('');
		}
	});
	
	//Calculate evaluation scores
	empTotal = 0;
	for(loopCount = 0; loopCount < $('tr').has('div[type*=emp]').find('input[name*=_calc]').length; loopCount++)
	{
		empTotal = parseInt(empTotal) + parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').eq(loopCount).val() ? $('tr').has('div[type*=emp]').find('input[name*=_calc]').eq(loopCount).val() : 0);
	}
	empScore = (parseInt(empTotal) / parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').length)).toFixed(1);
	$('tr').has('div[id=in1]').find('input').val(empScore + ' / 5');
	proTotal = 0;
	for(loopCount = 0; loopCount < $('tr').has('div[type*=pro]').find('input[name*=_calc]').length; loopCount++)
	{
		proTotal = parseInt(proTotal) + parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').eq(loopCount).val() ? $('tr').has('div[type*=pro]').find('input[name*=_calc]').eq(loopCount).val() : 0);
	}
	proScore = (parseInt(proTotal) / parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').length)).toFixed(1);
	$('tr').has('div[id=in2]').find('input').val(proScore + ' / 5');
	supTotal = 0;
	for(loopCount = 0; loopCount < $('tr').has('div[type=sup]').find('input[name*=_calc]').length; loopCount++)
	{
		supTotal = parseInt(supTotal) + parseInt($('tr').has('div[type*=sup]').find('input[name*=_calc]').eq(loopCount).val() ? $('tr').has('div[type*=sup]').find('input[name*=_calc]').eq(loopCount).val() : 0);
	}
	supScore = (parseInt(supTotal) / parseInt($('tr').has('div[type=sup]').find('input[name*=_calc]').length)).toFixed(1);
	$('tr').has('span[id=in3]').find('input').val(supScore + ' / 5');
	
	//Expanding Areas Requiring Improvment textarea on page load
	/*if($('tr').has('div[id=autoGenerate]').find('input').prop('checked') == false)
	{
		$('tr').has('div[id=autoGenerate]').find('input').trigger('click');
	}*/
	
	//Main event handler when questions are clicked
	$('tr').has('div[class=Q]').find('input').click(function()
	{
		index = $.inArray($('tr').has('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').find('div[class=Q]').html(), qArray);
		
		if(!$('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val())
		{
			$('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val('0');
		}

		//Calcuate evaluation scores each time questions are clicked before loading the value into qObject so we can add or subtract from total scores first
		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type').includes('emp'))
		{
			empTotal = (parseInt(empTotal)) + (parseInt($('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val() ? $('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val() : 0) - parseInt(qObject[index].val));
			empScore = (parseInt(empTotal) / parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in1]').find('input').val(empScore + ' / 5');
		}
		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type').includes('pro'))
		{
			proTotal = (parseInt(proTotal)) + (parseInt($('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val() ? $('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val() : 0) - parseInt(qObject[index].val));
			proScore = (parseInt(proTotal) / parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in2]').find('input').val(proScore + ' / 5');
		}
		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type') == 'sup')
		{
			supTotal = (parseInt(supTotal)) + (parseInt($('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val() ? $('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val() : 0) - parseInt(qObject[index].val));
			supScore = (parseInt(supTotal) / parseInt($('tr').has('div[type=sup]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('span[id=in3]').find('input').val(supScore + ' / 5');
		}

		//Setting value of clicked answer into it's spot in qObject
		qObject[index].val = $('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val();
		

		if(qObject[index].val > 0 && qObject[index].val < 3)
		{
			qObject[index].needed = true;
			$('#area' + index).show();
			$('#date' + index).val(qObject[index].date);
			$('#plan' + index).val(qObject[index].plan);
			$('#date' + index).prop('required', true);
			$('#plan' + index).prop('required', true);
			resize($('#plan' + index)[0]);
		}
		else
		{
			qObject[index].needed = false;
			$('#area' + index).hide();
			qObject[index].date = '';
			qObject[index].plan = '';
			$('#date' + index).prop('required', false);
			$('#plan' + index).prop('required', false); 
		}
		
		requireImprovement = false;
		for(loopCount = 0; loopCount < length; loopCount++)
		{
			if(qObject[loopCount].needed == true)
			{
				requireImprovement = true;
			}
		}
		if(requireImprovement)
		{
			$('div[id=noPlan]').hide();
		}
		else
		{
			$('div[id=noPlan]').show();
		}

		/*requireImprovement = false;
		$('tr').has('div[id=autoGenerate]').next().find('textarea').val('');
		for(loopCount = 0; loopCount < length; loopCount++)
		{
			if(qObject[loopCount].needed == true)
			{
				requireImprovement = true;
				
				$('tr').has('div[id=autoGenerate]').next().find('textarea').val($('tr').has('div[id=autoGenerate]').next().find('textarea').val() + qObject[loopCount].q + '\n\n');
			}
		}
		$('tr').has('div[id=autoGenerate]').next().find('textarea').val($('tr').has('div[id=autoGenerate]').next().find('textarea').val().slice(0, $('tr').has('div[id=autoGenerate]').next().find('textarea').val().length-2));
		if($('tr').has('div[id=autoGenerate]').next().find('textarea').val() == '')
		{
			$('tr').has('div[id=autoGenerate]').next().find('textarea').val('Above areas meeting/exceeding expectations');
			$('td').has('div[id=plan]').hide();
		}
		else
		{
			$('td').has('div[id=plan]').show();
		}
		$('tr').has('div[id=autoGenerate]').next().find('textarea').trigger('change');
		setTimeout(resize($('tr').has('div[id=autoGenerate]').next().find('textarea')[0]), 0);*/

		//Trying Something new, restore the following block if does not work
		/*//Calcuate evaluation scores each time questions are clicked
		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type').includes('emp'))
		{
			empTotal = 0;
			for(loopCount = 0; loopCount < $('tr').has('div[type*=emp]').find('input[name*=_calc]').length; loopCount++)
			{
				empTotal = parseInt(empTotal) + parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').eq(loopCount).val());
			}
			empScore = (parseInt(empTotal) / parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in1]').find('input').val(empScore + ' / 5');
		}
		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type').includes('pro'))
		{
			proTotal = 0;
			for(loopCount = 0; loopCount < $('tr').has('div[type*=pro]').find('input[name*=_calc]').length; loopCount++)
			{
				proTotal = parseInt(proTotal) + parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').eq(loopCount).val());
			}
			proTotal = (parseInt(proTotal) / parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in2]').find('input').val(proTotal + ' / 5');
		}
		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type') == 'sup')
		{
			supTotal = 0;
			
			for(loopCount = 0; loopCount < $('tr').has('div[type=sup]').find('input[name*=_calc]').length; loopCount++)
			{
				supTotal = parseInt(supTotal) + parseInt($('tr').has('div[type*=sup]').find('input[name*=_calc]').eq(loopCount).val());
			}
			supTotal = (parseInt(supTotal) / parseInt($('tr').has('div[type=sup]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in3]').find('input').val(supTotal + ' / 5');
		}*/

	});

	//Load values from qObject into Improvement Plan on page submit
	$('input[name=Complete]').click(function()
	{
		$('tr').has('div[id=victim]').next().find('textarea').val('');
		for(loopCount = 0; loopCount < length; loopCount++)
		{
			if(qObject[loopCount].needed == true)
			{
				$('tr').has('div[id=victim]').next().find('textarea').val($('tr').has('div[id=victim]').next().find('textarea').val() + 'Improvement Area: ' + qObject[loopCount].q + '\n' + 'Target Date: ' + qObject[loopCount].date + '\n' + 'Plan: ' + qObject[loopCount].plan + '\n\n');
			}
		}
		if($('tr').has('div[id=victim]').next().find('textarea').val() != '')
		{
			$('tr').has('div[id=victim]').find('input').prop('checked', true);
		}
		else
		{
			$('tr').has('div[id=victim]').find('input').prop('checked', true);
			$('tr').has('div[id=victim]').next().find('textarea').val(noPlanMessage);
		}
		if($('tr').has('div[id=victim]').next().find('textarea').val() != '' && $('tr').has('div[id=victim]').next().find('textarea').val() != noPlanMessage)
		{
			$('tr').has('div[id=victim]').next().find('textarea').val($('tr').has('div[id=victim]').next().find('textarea').val().slice(0, $('tr').has('div[id=victim]').next().find('textarea').val().length-2));
		}
	});

	//Load template for Development Plan
	if($('tr').has('div[id=additionalAreas]').next().find('textarea').val() == '')
	{
		$('tr').has('div[id=additionalAreas]').next().find('textarea').val('Area: \nTarget Date: \nPlan: \n\nArea: \nTarget Date: \nPlan: \n\nArea: \nTarget Date: \nPlan: ');
		$('tr').has('div[id=additionalAreas]').find('input').trigger('click');
	}
	$('tr').has('div[id=additionalAreas]').next().find('textarea').trigger('change');
	setTimeout(resize($('tr').has('div[id=additionalAreas]').next().find('textarea')[0]), 0);

	//Event handle to prevent non numerics and only allow one decimal in clinical scores and Custome Metric values
	$('tr').has('div[class=calc]').find('input').keyup(preventAlpha);

	//Prevent use of new line in temp Improvement Plan text areas
	$('.plans').keydown(function(e)
	{
		if (e.keyCode == 13)
		{
			e.preventDefault();
		}
	});

	//On page load see if we need to show or hide noPlan div
	requireImprovement = false;
	for(loopCount = 0; loopCount < length; loopCount++)
	{
		if(qObject[loopCount].needed == true)
		{
			requireImprovement = true;
		}
	}
	if(requireImprovement)
	{
		$('div[id=noPlan]').hide();
	}
	else
	{
		$('div[id=noPlan]').show();
	}

	//Button to refresh report if login error occurs
	$('input[id=refreshReport]').click(function()
	{
		setTimeout(function ()
		{
			$('#credibleBI').attr('src', function (i, val) 
			{ 
				return val; 
			});
		}, 250);
		$('#report').attr('src', function (i, val) 
		{ 
			return val; 
		});
	});

	//Trigger above event for user on page load
	$('input[id=refreshReport]').trigger('click');

	/*$('input[name=Complete]').click(function()
	{
		if(!$('tr').has('div[id=staffType]').find('input').eq(0).prop('checked') || !$('tr').has('div[id=staffType]').find('input').eq(2).prop('checked'))
		{
			$('tr').has('span[hidetype=clinical]').find('input').val();
		}
	});*/

	//Change Form Loading message to Form Loaded
	$('td').find('div[id=loadingForm]').text('Loaded. Thank you for waiting!');
	
	//Hide Loading Form label on Page Load
	setTimeout(function()
	{
		$('td').has('div[id=loadingForm]').hide();
	}, 1000);
}

async function asyncWaitForElement(context, selector) {
  return new Promise((resolve, reject) => {
    let el = context.querySelector(selector);
    if (el) {
      resolve(el);
    }
    new MutationObserver((mutationRecords, observer) => {
      const element = context.querySelector(selector);
      if (element) {
        resolve(element);
        observer.disconnect();
      }
    }).observe(context.documentElement, { childList: true, subtree: true });
  });
}

function createEmbed(reportName, empId, appendSelector) {
  const embedScript = document.createElement("script");
  embedScript.type = "text/javascript";
  embedScript.src = "https://reporting.kbbh.org:4443/javascripts/api/viz_v1.js";
  const container = document.createElement("div");
  container.id = "tableauContainer";
  container.innerHTML = `<div class='tableauPlaceholder'><object class='tableauViz' style='display:none;'> <param name='host_url' value='https%3A%2F%2Freporting.kbbh.org%3A4443%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /> <param name='name' value=${reportName} /> <param name='tabs' value='no' /> <param name='toolbar' value='yes' /> <param name='showAppBanner' value='false' /> <param name='filter' value=${
    "emp_id=" + empId
  } /> </object> </div>`;
  document.querySelector(appendSelector).appendChild(embedScript);
  document.querySelector(appendSelector).appendChild(container);
}

function partialToolbarHide(context) {
  context
    .querySelector("#viz-viewer-toolbar")
    .querySelectorAll(".toolbar-item")
    .forEach((tbBtn) => {
      if (tbBtn.id != "revert") {
        tbBtn.remove();
      }
    });
}

let emp_id = "";

async function getEmpId() {
  asyncWaitForElement(parent.document, "frame[name='left']")
    .then(() => {
      emp_id = new URL(
        parent.document
          .querySelector("frame[name='left']")
          .contentDocument.querySelector("#emp_view").href
      ).searchParams.get("emp_id");
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        if (emp_id != "") {
          resolve();
        }
      });
    });
}

getEmpId().then(() => {
  asyncWaitForElement(document, "#reportContainer").then(() => {
    createEmbed(
      "StaffProductivityReport/StaffProductivity",
      emp_id,
      "#reportContainer"
    );
  });
});


//Only run code if page has a Complete button
$(document).ready(function()
{
	waitForElement('input[name=Complete]', customCallBack, 10);
});

//Hide Showing Staff Activity Report Based on Clinical
function hideShowReport(){
	let show = false;
	document.querySelector('#reportContainer').hidden = true;

	[...document.querySelector('#staffType').closest('table').querySelectorAll('input')].filter((input) => {
		return input.closest('tr').innerHTML.includes('with caseload');
	}).forEach((input => {
		console.log(input);
		if(input.checked){
			show = true;
		}
	}));

	if(show){
		document.querySelector('#reportContainer').hidden = false;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	hideShowReport();
	[...document.querySelector('#staffType').closest('table').querySelectorAll('input')].forEach((input) => {
	    input.addEventListener('click', hideShowReport);
	    input.addEventListener('mouseleave', hideShowReport);
	}); 
});

//Highlighting Professionalism questions
//$('tr').find('div[type*=pro]').css('color', 'blue');
