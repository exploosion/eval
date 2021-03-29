var test;
var length;
var index;
var tempIndex;
var loopCount;
var qObject;
var qArray;
var tempArray;
var requireImprovement;
var split;
var empTotal;
var empScore;
var proTotal;
var proScore;
var supTotal;
var supScore;

//Function to resize textareas
function resize (x)
{
	$(x).height(0);
	$(x).height(x.scrollHeight);	
}

$(document).ready(function()
{
	length = $('div[class=Q]').length;
	qObject = [length];
	qArray = [length];
	tempArray = [length];
	
	//Events to drive textarea resizes
	$('tr').has('div[id=autoGenerate]').next().find('textarea').change(function()
	{
		resize(this);
	});
	$('.plans').keyup(function()
	{
		resize(this);
	});
	$('tr').has('div[id=additionalAreas]').next().find('textarea').keyup(function()
	{
		resize(this);
	});

	//Load Question titles into qArray and qObject
	for(loopCount = 0; loopCount < $('div[class=Q]').length; loopCount++)
	{
		qObject[loopCount] = {q:$('div[class=Q]').eq(loopCount).html(), date:'', plan:'', val:0, needed:false};
		qArray[loopCount] = qObject[loopCount].q;
	}
	
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
	if($('tr').has('div[id=victim]').next().find('textarea').val() != '')
	{
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
			}
		}
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
	setTimeout(resize($('tr').has('div[id=autoGenerate]').next().find('textarea')[0]), 0);
	
	//Some initial housekeeping
	$('tr').has('div[class*=nlcbBr]').find('input[type=checkbox]').before('<br>');
	$('tr').find('div[class*=nlcbBr]').css('display', 'inline');
	$('hr[class=line]').css({'margin-top':'-10px', 'width':'100em'});
	$('tr').find('div[class=Q]').css('display', 'inline');
	$('tr').has('div[class=hiddenHeader]').find('input').hide();
	$('tr').has('div[class=hiddenChecks]').find('input').hide();
	$('td').has('div[id=victim]').hide();
	$('u').contents().unwrap();
	$('input[name=Complete]').prop('disabled', false);
	$('tr').has('div[class*=uneditable]').find('input').prop('readonly', true);

	//Setting default parameters for error and late documentaion rates
	$('tr').has('div[id=expectedErrorRate]').find('input').val('5.0%');
	$('tr').has('div[id=expectedLateDocumentationRate]').find('input').val('5.0%');

	//On page load set clinical scores if fields are filed in
	$('tr').has('div[id=revenueScore]').find('input').val((($('tr').has('div[id=averageRevenue]').find('input').val() / $('tr').has('div[id=expectedRevenue]').find('input').val()).toFixed(1)) * 100 + '%');
	$('tr').has('div[id=billableHoursScore]').find('input').val((($('tr').has('div[id=averageBillableHours]').find('input').val() / $('tr').has('div[id=expectedBillableHours]').find('input').val()).toFixed(1)) * 100 + '%');
	$('tr').has('div[id=errorRateScore]').find('input').val($('tr').has('div[id=averageErrorRate]').find('input').val() + '%');
	if($('tr').has('div[id=averageErrorRate]').find('input').val() > $('tr').has('div[id=expectedErrorRate]').find('input').val())
	{
		$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'red');
		$('tr').has('div[id=errorRateScore]').find('input').css('color', 'red');
	}
	else
	{
		$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'black');
		$('tr').has('div[id=errorRateScore]').find('input').css('color', 'black');
	}
	$('tr').has('div[id=lateDocumentationRateScore]').find('input').val($('tr').has('div[id=averageLateDocumentationRate]').find('input').val() + '%');
	if($('tr').has('div[id=averageLateDocumentationRate]').find('input').val() > $('tr').has('div[id=expectedLateDocumentationRate]').find('input').val())
	{
		$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'red');
		$('tr').has('div[id=lateDocumentationRateScore]').find('input').css('color', 'red');
	}
	else
	{
		$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'black');
		$('tr').has('div[id=lateDocumentationRateScore]').find('input').css('color', 'black');
	}
	$('tr').has('div[id=customMetricScore]').find('input').val((($('tr').has('div[id=averageCustomMetric]').find('input').val() / $('tr').has('div[id=expectedCustomMetric]').find('input').val()).toFixed(1)) * 100 + '%');

	//Event handler for calculating clinical fields and custom metric field
	$('tr').has('div[class=calc]').change(function()
	{
		console.log('Yeet');
		$('tr').has('div[id=revenueScore]').find('input').val((($('tr').has('div[id=averageRevenue]').find('input').val() / $('tr').has('div[id=expectedRevenue]').find('input').val()).toFixed(1)) * 100 + '%');
		$('tr').has('div[id=billableHoursScore]').find('input').val((($('tr').has('div[id=averageBillableHours]').find('input').val() / $('tr').has('div[id=expectedBillableHours]').find('input').val()).toFixed(1)) * 100 + '%');
		$('tr').has('div[id=errorRateScore]').find('input').val($('tr').has('div[id=averageErrorRate]').find('input').val() + '%');
		if($('tr').has('div[id=averageErrorRate]').find('input').val() > $('tr').has('div[id=expectedErrorRate]').find('input').val())
		{
			$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'red');
			$('tr').has('div[id=errorRateScore]').find('input').css('color', 'red');
		}
		else
		{
			$('tr').has('div[id=averageErrorRate]').find('input').css('color', 'black');
			$('tr').has('div[id=errorRateScore]').find('input').css('color', 'black');
		}
		$('tr').has('div[id=lateDocumentationRateScore]').find('input').val($('tr').has('div[id=averageLateDocumentationRate]').find('input').val() + '%');
		if($('tr').has('div[id=averageLateDocumentationRate]').find('input').val() > $('tr').has('div[id=expectedLateDocumentationRate]').find('input').val())
		{
			$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'red');
			$('tr').has('div[id=lateDocumentationRateScore]').find('input').css('color', 'red');
		}
		else
		{
			$('tr').has('div[id=averageLateDocumentationRate]').find('input').css('color', 'black');
			$('tr').has('div[id=lateDocumentationRateScore]').find('input').css('color', 'black');
		}
		$('tr').has('div[id=customMetricScore]').find('input').val((($('tr').has('div[id=averageCustomMetric]').find('input').val() / $('tr').has('div[id=expectedCustomMetric]').find('input').val()).toFixed(1)) * 100 + '%');
	});

	//On page load, calculate evaluation scores
	empTotal = 0;
	for(loopCount = 0; loopCount < $('tr').has('div[type*=emp]').find('input[name*=_calc]').length; loopCount++)
	{
		if($('tr').has('div[type*=emp]').find('input[name*=_calc]').eq(loopCount).val())
		{
			empTotal = parseInt(empTotal) + parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').eq(loopCount).val());
		}
	}
	empScore = (parseInt(empTotal) / parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').length)).toFixed(1);
	$('tr').has('div[id=in1]').find('input').val(empScore + ' / 5');
	proTotal = 0;
	for(loopCount = 0; loopCount < $('tr').has('div[type*=pro]').find('input[name*=_calc]').length; loopCount++)
	{
		if($('tr').has('div[type*=pro]').find('input[name*=_calc]').eq(loopCount).val())
		{
			proTotal = parseInt(proTotal) + parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').eq(loopCount).val());
		}
	}
	proTotal = (parseInt(proTotal) / parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').length)).toFixed(1);
	$('tr').has('div[id=in2]').find('input').val(proTotal + ' / 5');
	supTotal = 0;
	for(loopCount = 0; loopCount < $('tr').has('div[type=sup]').find('input[name*=_calc]').length; loopCount++)
	{
		if($('tr').has('div[type=sup]').find('input[name*=_calc]').eq(loopCount).val())
		{
			supTotal = parseInt(supTotal) + parseInt($('tr').has('div[type*=sup]').find('input[name*=_calc]').eq(loopCount).val());
		}
	}
	supTotal = (parseInt(supTotal) / parseInt($('tr').has('div[type=sup]').find('input[name*=_calc]').length)).toFixed(1);
	$('tr').has('div[id=in3]').find('input').val(supTotal + ' / 5');
	
	//Expanding Areas Requiring Improvment textarea on page load
	if($('tr').has('div[id=autoGenerate]').find('input').prop('checked') == false)
	{
		$('tr').has('div[id=autoGenerate]').find('input').trigger('click');
	}
	
	//Main event handler when questions are clicked
	$('tr').has('div[class=Q]').find('input').click(function()
	{
		index = $.inArray($('tr').has('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').find('div[class=Q]').html(), qArray);
		qObject[index].val = $('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').val();
		
		if(qObject[index].val > 0 && qObject[index].val < 3)
		{
			qObject[index].needed = true;
			$('#area' + index).show();
			$('#date' + index).val(qObject[index].date);
			$('#plan' + index).val(qObject[index].plan);
			$('#date' + index).prop('required', true);
			$('#plan' + index).prop('required', true);
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
		console.log($.inArray($('tr').has('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').find('div').html(), qArray));
		
		requireImprovement = false;
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
		setTimeout(resize($('tr').has('div[id=autoGenerate]').next().find('textarea')[0]), 0);
				
		//Calcuate evaluation scores each time questions are clicked
		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type').includes('emp'))
		{
			empTotal = 0;
			for(loopCount = 0; loopCount < $('tr').has('div[type*=emp]').find('input[name*=_calc]').length; loopCount++)
			{
				if($('tr').has('div[type*=emp]').find('input[name*=_calc]').eq(loopCount).val())
				{
					empTotal = parseInt(empTotal) + parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').eq(loopCount).val());
				}
			}
			empScore = (parseInt(empTotal) / parseInt($('tr').has('div[type*=emp]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in1]').find('input').val(empScore + ' / 5');
		}

		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type').includes('pro'))
		{
			proTotal = 0;
			for(loopCount = 0; loopCount < $('tr').has('div[type*=pro]').find('input[name*=_calc]').length; loopCount++)
			{
				if($('tr').has('div[type*=pro]').find('input[name*=_calc]').eq(loopCount).val())
				{
					proTotal = parseInt(proTotal) + parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').eq(loopCount).val());
				}
			}
			proTotal = (parseInt(proTotal) / parseInt($('tr').has('div[type*=pro]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in2]').find('input').val(proTotal + ' / 5');
		}

		if($('tr').has('input[id=' + this.name + ']').find('div[class=Q]').attr('type') == 'sup')
		{
			supTotal = 0;

			
			for(loopCount = 0; loopCount < $('tr').has('div[type=sup]').find('input[name*=_calc]').length; loopCount++)
			{
				if($('tr').has('div[type=sup]').find('input[name*=_calc]').eq(loopCount).val())
				{
					supTotal = parseInt(supTotal) + parseInt($('tr').has('div[type*=sup]').find('input[name*=_calc]').eq(loopCount).val());
				}
			}
			supTotal = (parseInt(supTotal) / parseInt($('tr').has('div[type=sup]').find('input[name*=_calc]').length)).toFixed(1);
			$('tr').has('div[id=in3]').find('input').val(supTotal + ' / 5');
		}
	});

	//Load values from qArray into Improvement Plan on page submit
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
				$('tr').has('div[id=victim]').next().find('textarea').val($('tr').has('div[id=victim]').next().find('textarea').val().slice(0, $('tr').has('div[id=victim]').next().find('textarea').val().length-2));
	});

	//Load template for Development Plan
	if($('tr').has('div[id=additionalAreas]').next().find('textarea').val() == '')
	{
		$('tr').has('div[id=additionalAreas]').next().find('textarea').val('Area: \nTarget Date: \nPlan: \n\nArea: \nTarget Date: \nPlan: \n\nArea: \nTarget Date: \nPlan: ');
		$('tr').has('div[id=additionalAreas]').find('input').trigger('click');
		$('tr').has('div[id=additionalAreas]').next().find('textarea').trigger('change');
		setTimeout(resize($('tr').has('div[id=additionalAreas]').next().find('textarea')[0]), 0);
	}

	//Prevent use of new line in temp Improvement Plan text areas
	$('.plans').keydown(function(e)
	{
		if (e.keyCode == 13 && !e.shiftKey)
		{
			e.preventDefault();
		}
	});
});