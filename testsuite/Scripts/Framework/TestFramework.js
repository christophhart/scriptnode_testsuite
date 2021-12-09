namespace TestFramework
{
	const var ASSERT_ON_FAILURE = 1;
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
		Console.print("Completed test:   " + currentTestName + " - ran " + numTestRuns + " Tests. Failures: " + numFailures);
		
		if(ASSERT_ON_FAILURE && numFailures > 0)
		{
			Console.assertNoString(numFailures + " tests failed");
		}

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

		local fToLoad = FileSystem.getFolder(FileSystem.AudioFiles).getChildFile(fileName);

		

		if(!fToLoad.isFile())
		{
			Console.assertNoString("Can't find audio file " + fToLoad.toString(0));
		}

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
	
	inline function assertException(expectedException, errorMessage)
	{
		numTestRuns++;

		local e = currentTest.getLastTestException();
		
		if(expectedException != e)
		{
			numFailures++;

			Console.print("FAIL:  " + errorMessage);
			Console.print("Expected: " + expectedException);
			Console.print("Actual: " + e);
			
			return false;
		}
		
		return true;
	}
	
	inline function assertExceptionContains(exceptionType, errorMessage)
	{
		if(exceptionType.length == 0)
		{
			return assertNoException();
		}
	

		numTestRuns++;

		local e = currentTest.getLastTestException();
		
		local ok = e.indexOf(exceptionType) != -1;
		
		if(!ok)
		{
			numFailures++;

			Console.print("FAIL:  " + errorMessage);
			Console.print("Expected: " + exceptionType);
			Console.print("Actual: " + e);
			return false;
		}
		
		return true;
	}
	
	inline function assertNotEmpty(data, errorMessage)
	{
		numTestRuns++;

		local s = currentTest.expectEquals(data, 0.0, -100);
		
		if(s == 0)
		{
			numFailures++;
			Console.print("  FAIL: " + errorMessage);
			return false;
		}
		
		return true;
	}
	
	inline function assertSimilar(data1, data2, errorMessage)
	{
		numTestRuns++;
	
		if(Math.abs(data1 - data2) > 0.01)
		{
			Console.print("  FAIL: " + errorMessage);
			numFailures++;
			return false;
		}
		
		return true;
	}
	
	inline function assertConsistency()
		{
			local one = run();
			local two = run();
			
			return assertEquals(one, two, "inconsistent results between runs");
		}
	
	inline function assertUnEquals(data1, data2, errorMessage)
	{
		numTestRuns++;
		
		local s = currentTest.expectEquals(data1, data2, -100);

		if(s == 0)
		{
			Console.print("  FAIL: " + errorMessage);
			numFailures++;
		}
		
		return s != 0;
	}
	
	inline function assertEquals(data1, data2, errorMessage)
	{
		numTestRuns++;

		local s = currentTest.expectEquals(data1, data2, -90);

		if(s != 0)
		{
			Console.print("  FAIL: " + s + errorMessage);
			numFailures++;
		}
			
		return s == 0;
	}
	
	inline function assertSameAscii(data1, data2, message)
	{
		numTestRuns++;

		local numLines = 80;
		
		local ok = currentTest.createAsciiDiff(data1, data2, numLines);
		
		local error = ok.indexOf("X");
		
		
		
		if(error != -1)
		{
			local errorMessage = "  FAIL: " + message + "\n";
			
			errorMessage += "Error at ASCII diff:";
			
			errorMessage += ok;
			Console.print(errorMessage);
			
			numFailures++;
			
			return false;
		}
		
		return true;
	}
	
	inline function assertNoException()
	{
		numTestRuns++;

		const var m = currentTest.getLastTestException();
		
		if(m.length > 0)
		{
			Console.print("Fail: Exception thrown: " + m);
			numFailures++;
			
			return false;
		}
		
		return true;
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
			dump(dataToCompare, currentTestName, false);
			return true;
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
				
			return s == 0;
		}
	}
	
	inline function dump(data, filename, reveal)
	{
		local l = FileSystem.getFolder(FileSystem.AudioFiles).getChildFile(filename + ".wav");
		l.writeAudioFile(data, 44100.0, 24);
		Console.print("Written reference file " + l.toString(0));
		
		if(reveal)
			l.show();
	}
	
	inline function dumpAscii(d)
	{
		local l = currentTest.createBufferContentAsAsciiArt(d, 80);
		Console.print(l);
	}
	
}