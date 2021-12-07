namespace XFadeTest
{
	const var n = TestFramework.reset("xfader",
	{
		FactoryPath: "container.chain", Nodes: [
			{ FactoryPath: "control.xfader", ID: "xf" },
			{ FactoryPath: "container.split", Nodes: [
			  { FactoryPath: "math.mul", ID: "mul1"},
			  { FactoryPath: "container.chain", Nodes: [
			  { FactoryPath: "core.fix_delay", ID: "delay"},
			  { FactoryPath: "math.mul", ID: "mul2"}
			  ]}
			  ]
			}	
		]
	},
	{
		"delay.FadeTime": 0.0,
		"delay.DelayTime": 10.0,
		"xf.Value": 0.5
	});
	
	const var xf = n.get("xf");
	const var t = TestFramework.createTest(TestData.Impulse4096);
	
	t.setProcessSpecs(1, 48000.0, 256);
	
	TestFramework.connectSingle("xf", 0, "mul1", "Value");
	TestFramework.connectSingle("xf", 1, "mul2", "Value");
	
	inline function expectValue(fadeValue, fadeStyle, expected)
	{
		xf.getParameter("Value").setValueSync(fadeValue);
	
		xf.set("Mode", fadeStyle);
	
		local b = TestFramework.run();
		
		local v1 = b[0];
		local v2 = b[480];
		
		TestFramework.assertEquals(v1, expected[0], "first value at " + fadeValue + " with " + fadeStyle +  ": " + v1 + " (expected: " + expected[0] + ")");
		TestFramework.assertEquals(v2, expected[1], "second value at " + fadeValue + " with " + fadeStyle +": " + v2 + " (expected: " + expected[1] + ")");
	}
	
	expectValue(0.25, "Switch", [1.0, 0.0]);
	expectValue(0.5, "Switch", [0.0, 1.0]);
	expectValue(0.75, "Switch", [0.0, 1.0]);
	
	expectValue(0.0,  "Linear", [1.0, 0.0]);
	expectValue(0.25, "Linear", [0.75, 0.25]);
	expectValue(0.5,  "Linear", [0.5, 0.5]);
	expectValue(0.75, "Linear", [0.25, 0.75]);
	expectValue(1.0,  "Linear", [0.0, 1.0]);
	
	expectValue(0.0,  "Overlap", [1.0, 0.0]);
	expectValue(0.25, "Overlap", [1.0, 0.5]);
	expectValue(0.75, "Overlap", [0.5, 1.0]);
	expectValue(1.0,  "Overlap", [0.0, 1.0]);
	
	expectValue(0.0,  "Squared", [1.0, 0.0]);
	expectValue(0.25, "Squared", [0.75 * 0.75, 0.25 * 0.25]);
	expectValue(0.5,  "Squared", [0.5 * 0.5, 0.5 * 0.5]);
	expectValue(0.75, "Squared", [0.25 * 0.25, 0.75 * 0.75]);
	expectValue(1.0,  "Squared", [0.0, 1.0]);
	
	expectValue(0.0,  "RMS", [1.0, 0.0]);
	expectValue(0.25, "RMS", [Math.sqrt(0.75), Math.sqrt(0.25)]);
	expectValue(0.5,  "RMS", [Math.sqrt(0.5), Math.sqrt(0.5)]);
	expectValue(0.75, "RMS", [Math.sqrt(0.25), Math.sqrt(0.75)]);
	expectValue(1.0,  "RMS", [0.0, 1.0]);
	
	TestFramework.flush();
}