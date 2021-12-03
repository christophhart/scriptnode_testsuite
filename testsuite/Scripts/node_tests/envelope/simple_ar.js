namespace SimpleArTest
{
	const var n = TestFramework.reset("envelope-simple_ar", {
		FactoryPath: "container.midichain", ID: "chain", Nodes: [
		{ FactoryPath: "math.add", ID: "add"},
		{ FactoryPath: "envelope.simple_ar", ID: "env"}]
	}, 
	{
		"add.Value": 1.0,
		"env.Gate": 0.0,
		"env.Attack": 50.0,
		"env.Release": 50.0
	});
	
	const var p = TestFramework.createRootParameter("Gate", 0.0);
	
	TestFramework.connectSingle("dsp", "Gate", "env", "Gate");
	
	TestFramework.createTest({
	  "NodeId": "dsp",
	  "SignalType": "Empty",
	  "SignalLength": 16384,
	  "ParameterEvents": [
	    { "Index": 0, "Value": 0.0, "Timestamp": 0 },
	    { "Index": 0, "Value": 1.0, "Timestamp": 496 },
	    { "Index": 0, "Value": 0.0, "Timestamp": 8000 }
	  ]
	});
	
	TestFramework.assertConsistency();
	
	reg b = TestFramework.run();
	
	TestFramework.assertNotEmpty(b, "default is empty");
	TestFramework.assertSimilar(b[0], 0.0, "start is not zero");
	TestFramework.assertSimilar(b[7999], 1.0, "hold is not 1");
	TestFramework.assertSimilar(b[16000], 0.0, "after release not zero");
	
	TestFramework.createTest({
	  "NodeId": "dsp",
	  "SignalType": "Empty",
	  "SignalLength": 16384,
	  "HiseEvents": [
	    { "Type": "NoteOn", "Channel": 1, "Value1": 64, "Value2": 127, "Timestamp": 496 },
	    { "Type": "NoteOff", "Channel": 1, "Value1": 64, "Value2": 127, "Timestamp": 8000 }
	  ]
	});
	
	TestFramework.assertConsistency();
	
	const var mb = TestFramework.run();
	
	TestFramework.assertEquals(b, mb, "MIDI buffer != parameter buffer");
	
	TestFramework.flush();
}