namespace MultiTest
{
	//! Simple Multi test

	TestFramework.reset("simple multi test", {
		FactoryPath: "container.multi", Nodes:
		[
		{ FactoryPath: "math.add", ID: "left_add"},
		{ FactoryPath: "math.add", ID: "right_add"}]
	}, {
		"left_add.Value": 0.5,
		"right_add.Value": 0.8
	});
	
	reg t = TestFramework.createTest(TestData.Empty512);
	
	t.setProcessSpecs(2, 44100, 128);
	reg result = TestFramework.run();
	
	TestFramework.assertEquals(result[0][0], 0.5, "left channel doesn't work");
	TestFramework.assertEquals(result[1][0], 0.8, "left channel doesn't work");
	
	TestFramework.flush();
	
	//! MIDI Test ===================================================================
	
	reg n = TestFramework.reset("multi midi test", {
		FactoryPath: "container.multi", ID: "multi", Nodes: [
		
		{ FactoryPath: "container.midichain", Nodes: [
		  { FactoryPath: "math.add", ID: "add" },
		  { FactoryPath: "envelope.simple_ar", ID: "env"}
		]},
		{ FactoryPath: "math.clear", ID: "clear" }]
	}, {
		"add.Value": 1.0
	});
	
	const var t2 = TestFramework.createTest(TestData.Empty8192WithSingleNote);
	
	TestFramework.run();
	TestFramework.assertException(
	  "multi - **Number of child nodes (2) exceed channels (1).", 
	  "single channel doesn't throw exception");
	
	
	t2.setProcessSpecs(2, 44100.0, 256);
	
	TestFramework.assertConsistency();
	TestFramework.assertNoException();
	
	reg mresult = TestFramework.run();
	
	TestFramework.assertNotEmpty(mresult[0], "multi doesn't process midi on first channel");
	
	n.get("clear").setParent("multi", 0);
	
	mresult = TestFramework.run();
	
	TestFramework.assertNotEmpty(mresult[1], "multi doesn't process midi on second channel");
	
	TestFramework.flush();
}