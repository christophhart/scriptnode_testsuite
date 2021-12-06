// Tests the MIDI processing of all child nodes in a split node
namespace SplitMidiTest
{
	//! Setup =====================================================================

	const var n = TestFramework.reset("splitmidi_test",
	{
	  FactoryPath: "container.split", ID: "split",
	  Nodes: [
		{
		  FactoryPath: "container.midichain",
		  Nodes: [
		    { FactoryPath: "control.midi",       ID: "midi_gate"},
		    { FactoryPath: "control.logic_op",   ID: "logic_op"},
			{ FactoryPath: "core.oscillator", 	 ID: "osc"},
			{ FactoryPath: "envelope.simple_ar", ID: "env"}
		  ]
		},
		{ FactoryPath: "container.chain", ID: "other" }
		]
	}, 
	{
		"logic_op.Operator": 1,
		"osc.Mode": 3,
		"osc.Gain": 0.5,
		"osc.Gate": 0.0,
		"env.Attack": 0,
		"env.Release": 40
	});
	
	TestFramework.connect([ ["midi_gate", 0, "logic_op", "Left" ],
	                        ["env", 	  1, "logic_op", "Right"],
	                        ["logic_op",  0, "osc", 	 "Gate" ]]);
	
	TestFramework.createTest(TestData.Empty8192WithSingleNote);
	
	TestFramework.assertConsistency();
	
	
	//! Run Test ===================================================================
	
	const var before = TestFramework.run();

	// Switch the split children
	n["other"].setParent(n["split"], 0);
	
	const var after = TestFramework.run();
	
	//! Check conditions ===========================================================
	
	TestFramework.equalsReferenceFile(before);
	TestFramework.assertNotEmpty(before, 		"midichain works");
	TestFramework.assertNotEmpty(after, 		"empty after swap");
	TestFramework.assertEquals(before, after,   "swapping split elements retain MIDI processing");
	
	TestFramework.flush();
}