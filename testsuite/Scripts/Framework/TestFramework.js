namespace TestFramework
{
	const var ASSERT_ON_FAILURE = 0;
	Console.clear();

	const var dsp = Engine.createDspNetwork("dsp");


	reg currentTest;
	reg currentTestName;

	const var audioFiles = FileSystem.getFolder(FileSystem.AudioFiles);
	
	reg existingData;
	reg numTestRuns = 0;
	reg numFailures = 0;

	inline function flush()
	{
		Console.print("End Test:   " + currentTestName + " - ran " + numTestRuns + " Tests. Failures: " + numFailures);
		
		existingData = 0;
		currentTest = {};
		currentTestName = "";
		numTestRuns = 0;
		numFailures = 0;
	}

	inline function reset(testName, treeObj, parameterData)
	{
		currentTestName = testName;
		
		local af = audioFiles.getChildFile(testName + ".wav");
		
		if(af.isFile())
		{
			existingData = af.loadAsAudioFile();
		}
		else
		{
			existingData = undefined;
		}
			
		Console.print("Begin Test: " + testName);

		dsp.clear(true, true);
		dsp.createFromJSON(treeObj, dsp);
		dsp.setParameterDataFromJSON(parameterData);
		
		return dsp;
	}
	
	inline function createRootParameter(name, initialValue)
	{
		local p = dsp.get("dsp").getParameter(name);
		p.setValueSync(initialValue);
		return p;
	}
	
	inline function connectSingle(source, sourceIndex, targetNode, parameter)
	{
		dsp.get(source).connectTo(dsp.get(targetNode).getParameter(parameter), sourceIndex);
	}
	
	inline function connect(data)
	{
		for(s in data)
		{
			connectSingle(s[0], s[1], s[2], s[3]);
		}
	}
	
	
	inline function loadAudioFile(name, fileName)
	{
		local c = dsp.get("conv");
		c.setComplexDataIndex("AudioFile", 0, 0);
		local af = Engine.createAndRegisterAudioFile(0);
		af.loadFile("{PROJECT_FOLDER}" + fileName);
	}
	
	inline function setTableData(name, initialPointArray)
	{
		local t = dsp.get(name);
		t.setComplexDataIndex("Table", 0, 0);
		local tableData = Engine.createAndRegisterTableData(0);
	
		tableData.setTablePointsFromArray(initialPointArray);
		
		return tableData;
	}
	
	inline function assertNotEmpty(data, errorMessage)
	{
		numTestRuns++;

		local s = currentTest.expectEquals(data, 0.0, -100);
		
		if(s == 0)
		{
			numFailures++;
			Console.print("  FAIL: " + errorMessage);
		}
			

		if(ASSERT_ON_FAILURE)
			Console.assertTrue(s != 0);
	}
	
	inline function assertSimilar(data1, data2, errorMessage)
	{
		numTestRuns++;
	
		if(Math.abs(data1 - data2) > 0.01)
		{
			Console.print("  FAIL: " + errorMessage);
			numFailures++;
			
			if(ASSERT_ON_FAILURE)
				Console.assertTrue(false);
		}
	}
	
	inline function assertConsistency()
		{
			local one = run();
			local two = run();
			
			assertEquals(one, two, "inconsistent results between runs");
		}
	
	inline function assertEquals(data1, data2, errorMessage)
	{
		numTestRuns++;

		local s = currentTest.expectEquals(data1, data2, -100);

		if(s != 0)
		{
			Console.print("  FAIL: " + errorMessage);
			numFailures++;
		}
			
		if(ASSERT_ON_FAILURE)
			Console.assertNoString(s);
	}
	
	inline function createTest(data)
	{
		currentTest = dsp.createTest(data);
		return currentTest;
	}
	
	inline function run()
	{
		return currentTest.runTest();
	}
	
	inline function equalsReferenceFile(dataToCompare)
	{
		if(!isDefined(existingData))
		{
			local af = audioFiles.getChildFile(currentTestName + ".wav");
					
			af.writeAudioFile(dataToCompare, 44100.0, 24);
			Console.print("Written reference file " + af.toString(0));
		}
		else
		{
			numTestRuns++;

			local s = currentTest.expectEquals(existingData, dataToCompare, -99.0);
			
			if(s != 0)
			{
				numFailures++;
				Console.print("  FAIL: Not equal to reference file");
				Console.print("   " + s);
			}
				
			if(ASSERT_ON_FAILURE)
				Console.assertNoString(s);
		}
	}
}