namespace ExprTest
{
	const var n = TestFramework.reset("expr", 
	{
		FactoryPath: "math.expr", ID: "expr"
	}, 
	{
		"expr.Value": 0.5
	});
	
	const var expr = n.get("expr");
	
	TestFramework.createTest(TestData.Ramp1024);
	
	expr.set("Code", "value * Math.sin(input * (float)Math.PI)");
	
	TestFramework.assertNoException();
	TestFramework.assertConsistency();
	
	const var b = TestFramework.run();
	
	inline function getExprValue(index)
	{
		local input = index / 1024.0;
		return 0.5 * Math.sin(input * Math.PI);
	}
	
	TestFramework.assertEquals(b[900], getExprValue(900), "value at 90");
	TestFramework.assertEquals(b[20], getExprValue(20), "value at 90");
	TestFramework.assertEquals(b[60], getExprValue(60), "value at 90");
	TestFramework.assertEquals(b[90], getExprValue(90), "value at 90");
	
	n.setParameterDataFromJSON({ "expr.Value": 0.3 });
	expr.set("Code", "value * 2.0f");
	
	const var staticBuffer = TestFramework.run();
	
	TestFramework.assertEquals(staticBuffer, 0.6, "static buffer doesn't work");
	
	TestFramework.flush();
}