namespace RampTest
{
	const var t = TestFramework.reset("core_ramp", {
		FactoryPath: "container.frame2_block", ID: "frame", Nodes: [
		{ FactoryPath: "core.ramp", ID: "ramp" },
		{ FactoryPath: "math.clear" },
		{ FactoryPath: "math.add", ID: "add" }
		]
	}, 
	{
		"ramp.PeriodTime": 80.0,
		"ramp.LoopStart": 0.2
	});
	
	TestFramework.connectSingle("ramp", 0, "add", "Value");
	const var test = TestFramework.createTest(TestData.Empty8192);
	
	test.setProcessSpecs(2, 44100.0, 512);
	
	
	TestFramework.assertConsistency();
	
	reg before = TestFramework.run()[0];
	
	t.get("clear").setBypassed(true);
	t.get("add").setBypassed(true);
	
	reg after = TestFramework.run()[0];
	
	TestFramework.assertUnEquals(before[0], before[8], "modulation has block  staircase");
	
	TestFramework.assertEquals(before, after, "frame modulation not the same");
	
	t.get("frame").setBypassed(true);
	
	t.get("clear").setBypassed(false);
	t.get("add").setBypassed(false);
	
	reg block = TestFramework.run()[0];
	
	TestFramework.assertEquals(block[0], block[200], "no staircase");
	
	TestFramework.flush();
}