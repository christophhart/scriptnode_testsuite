
namespace GainTest
{
	const var n = TestFramework.reset("core_gain",
	{
		FactoryPath: "core.gain", ID: "gain"
	},
	{
		"gain.Gain": -12.0,
		"gain.ResetValue": -0.0,
		"gain.Smoothing": 10.0
	});
	
	const var t = TestFramework.createTest(TestData.Static4096);
	
	t.setProcessSpecs(2, 44100.0, 128);
	
	TestFramework.assertConsistency();
	const var b = TestFramework.run();
	
	TestFramework.assertEquals(b[0], b[1], "stereo operation doesn't work");
	TestFramework.assertSimilar(b[0][0], 1.0, "initValue doesn't match");
	TestFramework.assertSimilar(b[0][220], 0.625, "halfValue doesn't match: " + b[0][220]);
	TestFramework.assertSimilar(b[0][441], 0.25, "targetValue doesn't match: " + b[0][441]);
	TestFramework.flush();
}