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
	

	n.setParameterDataFromJSON({"env.Release": 20.0});

	TestFramework.createTest(TestData.Empty16kWithSustainedNote);
	
	b = TestFramework.run();
	
	TestFramework.assertEquals(b[7000], 1.0, "sustain doesn't hold note");
	TestFramework.assertEquals(b[11000], 1.0, "sustain doesn't hold second note");
	TestFramework.assertEquals(b[16380], 0.0, "sustain off doesn't work");
	

	const var t = TestFramework.createTest({
		  "NodeId": "dsp",
		  "SignalType": "Empty",
		  "SignalLength": 16384,
		  "ParameterEvents": [
		    { "Index": 0, "Value": 0.0, "Timestamp": 0 },
		    { "Index": 0, "Value": 1.0, "Timestamp": 1000 }
		  ]
		});

	t.setProcessSpecs(1, 44100, 512);
	const var attackTimeSamples = 4410 * 3;
	const var i0 = 999;
	const var i1 = i0 + attackTimeSamples * 0.5;
	const var i2 = i0 + attackTimeSamples;

	n.setParameterDataFromJSON({"env.AttackCurve": 0.0, "env.Attack": 300.0});
	b = TestFramework.run();

	TestFramework.assertEquals(b[i0], 0.0, "attack start point at zero curve");
	TestFramework.assertSimilar(b[i1], 0.9, "half point at zero curve");
	TestFramework.assertSimilar(b[i2], 1.0, "attack end point at zero curve");

	n.setParameterDataFromJSON({"env.AttackCurve": 0.5, "env.Attack": 300.0});
	b = TestFramework.run();

	TestFramework.assertEquals(b[i0], 0.0, "attack start point at linear");
	TestFramework.assertSimilar(b[i1], 0.5, "half point at linear");
	TestFramework.assertSimilar(b[i2], 1.0, "attack end point at linear");	
	
	n.setParameterDataFromJSON({"env.AttackCurve": 1.0, "env.Attack": 300.0});
	b = TestFramework.run();

	TestFramework.assertEquals(b[i0], 0.0, "attack start point at linear");
	TestFramework.assertSimilar(b[i1], 0.11, "half point at linear");
	TestFramework.assertSimilar(b[i2], 1.0, "attack end point at linear");	

	TestFramework.flush();
}