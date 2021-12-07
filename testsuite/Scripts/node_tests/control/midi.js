namespace ControlMidiTest
{
	const var n = TestFramework.reset("control_midi", 
	{
		FactoryPath: "container.midichain", Nodes: [
		{ FactoryPath: "control.midi", ID: "midi"},
		{ FactoryPath: "core.oscillator", ID: "osc"}]
	},
	{
		
	});
	
	TestFramework.connectSingle("midi", 0, "osc", "Gain");
	TestFramework.createTest(TestData.Empty8192WithSingleNote);
	
	TestFramework.assertConsistency();
	TestFramework.assertSimilar(TestFramework.run().getMagnitude(), 1.0, "gate doesn't work");
	
	n.get("midi").set("Mode", "Velocity");
	
	TestFramework.assertSimilar(TestFramework.run().getMagnitude(), 0.63, "velocity doesn't work");
	TestFramework.flush();
}