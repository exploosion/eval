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
	
	for(loopCount = 0; loopCount < $('div[class=Q]').length; loopCount++)
	{
		qObject[loopCount] = {q:$('div[class=Q]').eq(loopCount).html(), date:'', plan:'', val:0, needed:false};
		qArray[loopCount] = qObject[loopCount].q;
	}
	
	for(loopCount = 0; loopCount < length; loopCount++)
	{
		$('div[id=plan]').html($('div[id=plan]').html() + ( '<div class=\'areas\' id=\'area' + loopCount + '\'>' + '<label id-=\'' + 'label' + loopCount + '\'>Improvement Area: </label>' + qObject[loopCount].q + '<br>') + ('<label>Target Date:</label><br><input class=\'dates\'id=\'' + 'date' + loopCount + '\' type=\'date\'></input><br>') + ('<label>Plan:</label><br><textarea class=\'plans\' id=\'' + 'plan' + loopCount + '\' cols=\'71\'></textarea><br><br>' + '</div>'));
	}
	$('.dates').change(function()
	{
		tempIndex = this.id.slice(4);
		
		qObject[tempIndex].date = $('#date' + tempIndex ).val();
		console.log(qObject[tempIndex].date);
	});
	$('.plans').change(function()
	{
		tempIndex = this.id.slice(4);
		
		qObject[tempIndex].plan = $('#plan' + tempIndex ).val();
	});
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
				index = index + 3;
			}
		}
	}
	for(loopCount = 0; loopCount < length; loopCount++)
	{
		if(qObject[loopCount].needed == false)
		{
			$('#area' + loopCount).hide();
		}
	}
	
	$('tr').has('div[class*=nlcbBr]').find('input[type=checkbox]').before('<br>');
	$('tr').find('div[class*=nlcbBr]').css('display', 'inline');
	$('hr[class=line]').css({'margin-top':'-10px', 'width':'100em'});
	$('tr').find('div[class=Q]').css('display', 'inline');
	$('tr').has('div[class=hiddenHeader]').find('input').hide();
	$('u').contents().unwrap();
	$('input[name=Complete]').prop('disabled', false);
	
	if($('tr').has('div[id=autoGenerate]').find('input').prop('checked') == false)
	{
		$('tr').has('div[id=autoGenerate]').find('input').trigger('click');
	}
	
	$('tr').has('div[class=Q]').find('input').click(function()
	{
		index = $.inArray($('tr').has('input[name=q' + this.name.substring(1,this.name.length) + '_calc]').find('div').html(), qArray);
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
		$('tr').has('div[id=autoGenerate]').next().find('textarea').trigger('change');
	});
	

	$('tr').has('div[id=autoGenerate]').next().find('textarea').change(function()
	{
		resize(this);
	});
	$('.plans').keyup(function()
	{
		resize(this);
	});
	
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

	$('.plans').keydown(function(e)
	{
		if (e.keyCode == 13 && !e.shiftKey)
		{
			e.preventDefault();
		}
	});
});