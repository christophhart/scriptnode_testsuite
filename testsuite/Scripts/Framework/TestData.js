namespace TestData
{
	inline function empty(length)
	{
		return 	{
		  "NodeId": "dsp",
		  "SignalType": "Empty",
		  "SignalLength": length
		};
	}
	
	const var Empty512 =
	{
	  "NodeId": "dsp",
	  "SignalType": "Empty",
	  "SignalLength": 512
	};
	
	const var Empty1024 =
	{
	  "NodeId": "dsp",
	  "SignalType": "Empty",
	  "SignalLength": 1024
	};
	
	const var Static4096 = 
	{
	  "NodeId": "dsp",
	  "SignalType": "0dB Static",
	  "SignalLength": 4096
	};

	const var Ramp1024 =
	{
	  "NodeId": "dsp",
	  "SignalType": "Ramp",
	  "SignalLength": 1024
	};

	const var Ramp8192 =
	{
	  "NodeId": "dsp",
	  "SignalType": "Ramp",
	  "SignalLength": 8192
	};
	
	const var Impulse4096 =
	{
	  "NodeId": "dsp",
	  "SignalType": "Impulse",
	  "SignalLength": 4096
	};
	
	const var Empty8192 =
		{
		  "NodeId": "dsp",
		  "SignalType": "Empty",
		  "SignalLength": 8192
		};
	
	const var Empty8192ParameterOffOn = 
	{
	  "NodeId": "dsp",
	  "SignalType": "Empty",
	  "SignalLength": 8192,
	  "ParameterEvents": [
	    {
	      "Index": 0,
	      "Value": 0.0,
	      "Timestamp": 0
	    },
	    {
		   "Index": 1,
		   "Value": 1.0,
		   "Timestamp": 512
	    }
	  ]
	};

	const var OneKhzSine4096 = {
	  "NodeId": "dsp",
	  "SignalType": "1kHz Sine",
	  "SignalLength": 4096
	};

	const var Empty8192WithSingleNote =
	{
	  "NodeId": "dsp",
	  "SignalType": "Empty",
	  "SignalLength": 8192,
	  "HiseEvents": [
	    { "Type": "NoteOn", "Channel": 1, "Value1": 22, "Value2": 80, "Timestamp": 256 },
	    { "Type": "NoteOff", "Channel": 1, "Value1": 22, "Value2": 127, "Timestamp": 5000 }
	  ],
	};
	
	const var Empty16kWithSustainedNote = 
	{
	  "NodeId": "dsp",
	  "SignalType": "Empty",
	  "SignalLength": 16384,
	  "HiseEvents": [
	    { "Type": "NoteOn", "Channel": 1, "Value1": 51, "Value2": 127, "Timestamp": 2000 },
	    { "Type": "Controller", "Channel": 1,"Value1": 64, "Value2": 127, "Timestamp": 4000 },
	    { "Type": "NoteOff", "Channel": 1, "Value1": 51, "Value2": 127, "Timestamp": 6000 },
	    { "Type": "NoteOn", "Channel": 1, "Value1": 66, "Value2": 127, "Timestamp": 8000 },
	    { "Type": "NoteOff", "Channel": 1, "Value1": 66, "Value2": 127, "Timestamp": 10000 },
	    { "Type": "Controller", "Channel": 1, "Value1": 64, "Value2": 0, "Timestamp": 12000 }
	  ],
	  "ParameterEvents": []
	};
}