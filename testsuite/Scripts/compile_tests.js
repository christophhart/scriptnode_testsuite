
include("CompileTestData.js");


namespace CompileTest
{
	const var dsp = Engine.createDspNetwork("dsp");
	const var initTest = dsp.createTest(TestData.Empty512);
	
	Console.assertNoString(initTest.checkCompileHashCodes());
	
	const var dllInfo = initTest.getDllInfo();

	if(dllInfo.InitError.length > 0)
	{
		Console.print("DLL Error: ");

		Console.print(dllInfo.InitError);	
	}

	reg nodeString = "Found these nodes in DLL: ";

	for(n in dllInfo.Nodes)
	{
		nodeString += n;
		nodeString += ", ";
	}

	Console.print(nodeString);

	const var compiledNodes = initTest.getListOfCompiledNodes();
	const var compileableNodes = initTest.getListOfAllCompileableNodes();
	
	TestFramework.currentTest = initTest;
	TestFramework.assertEquals(compiledNodes.length, compileableNodes.length, "there are uncompiled nodes!");
	
	inline function testCompiledNode(name)
	{
		if(CompileTestData.SOLO_TEST.length > 0)
		{
			if(CompileTestData.SOLO_TEST != name)
			{
				Console.print("Skip test " + name);
				return;
			}
		}
	
		local testObj = CompileTestData.Data[name];
			
		Console.assertIsDefined(testObj.Parameters);
		Console.assertIsDefined(testObj.Signal);
		Console.assertIsDefined(testObj.Specs);
	
		local uSpecs = testObj.Specs;
		local cSpecs = testObj.Specs;

		local n = TestFramework.reset(name,
		{
			FactoryPath: "project." + name, ID: "compiled_node"
		}, testObj.Parameters);
		
		local cn = n.get("compiled_node");
		cn.set("Frozen", 0);
		
		n.setParameterDataFromJSON(testObj.Parameters);

		local t = TestFramework.createTest(testObj.Signal);
		Console.assertNoString(t.checkCompileHashCodes());

		if(isDefined(testObj.preInterpretedCallback))
		{
			testObj.preInterpretedCallback(n);
		}

		TestFramework.assertConsistency();
		
		t.setProcessSpecs(uSpecs[0], uSpecs[1], uSpecs[2]);
		TestFramework.run();
		TestFramework.assertNoException();

		local uncompiledResult = TestFramework.run();
		
		TestFramework.assertNoException();
		TestFramework.assertNotEmpty(uncompiledResult, "uncompiled is empty");
		
		if(isDefined(testObj.preCompileCallback))
		{
			testObj.preCompileCallback(n);
		}
		
		cn.set("Frozen", 1);
		
		TestFramework.assertConsistency();	
		TestFramework.assertNoException();

		//! Test mono processing throwing an error

		t.setProcessSpecs(1, uSpecs[1], uSpecs[2]);
		TestFramework.run();
		TestFramework.assertException("compiled_node - **Channel amount mismatch**:  \n`1` (expected: `2`)", 
			                          "mono processing doesn't throw");

		t.setProcessSpecs(cSpecs[0], cSpecs[1], cSpecs[2]);
		
		local compiledResult  = TestFramework.run();
		
		local asciiOk = TestFramework.assertSameAscii(uncompiledResult, compiledResult, "compiled node output doesn't match uncompiled output");
		local exactOk = TestFramework.assertEquals(uncompiledResult, compiledResult, "not a exact match");
		
		if(asciiOk && !exactOk)
		{
			TestFramework.dump(compiledResult, name + "_compiled", false);
			TestFramework.dump(uncompiledResult, name + "_uncompiled", true);
		}

		if(testObj.Dump)
		{
			Console.print("Uncompiled data: ");
			TestFramework.dumpAscii(uncompiledResult);
			Console.print("Compiled data: ");
			TestFramework.dumpAscii(compiledResult);
		}

		TestFramework.assertNoException();	
		TestFramework.flush();
	}
	
	for(cn in compiledNodes)
	    testCompiledNode(cn);
}