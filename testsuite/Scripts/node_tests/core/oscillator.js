namespace OscillatorTest
{
	const var n = TestFramework.reset("core_oscillator",
	{
		FactoryPath: "container.midichain", Nodes: [
		{ FactoryPath: "core.oscillator", ID: "osc" }
		]},
	{
		"osc.Frequency": 100,
		"osc.Mode": 3
	});
	
	TestFramework.createTest(TestData.Empty8192WithSingleNote);
	
	TestFramework.assertConsistency();
	
	reg l = TestFramework.run();
	
	TestFramework.assertNotEmpty(l, "oscillator is silent");
	
	TestFramework.flush();	
}