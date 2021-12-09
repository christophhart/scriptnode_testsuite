

namespace SendReceiveTests
{
	const var specsToTest = [[1, 44100.0, 512],
							 [2, 48000.0, 128],
							 [3, 96000.0, 256]];
	
	
	inline function testExceptions(receiveContainer, sendContainer, expectedException)
	{
		local testName = "sendreceive::";
		
		testName += receiveContainer[0];
		
		if(receiveContainer[1])
		    testName += "[bypassed]";
		
		testName += "<->";
		
		testName += sendContainer[0];
			
		if(sendContainer[1])
		    testName += "[bypassed]";
		
	
		local n = TestFramework.reset(testName, 
		{
			FactoryPath: "container.chain", ID: "chain", Nodes: [
			  {
				  FactoryPath: "container." + receiveContainer[0], ID: "rcontainer", Nodes: 
				  [{ FactoryPath: "routing.receive", ID: "receive" }]
			  },
			  {
				  FactoryPath: "container." + sendContainer[0], ID: "scontainer", Nodes:
				  [{ FactoryPath: "routing.send", ID: "send" }]
			  }
			 
			]
		}, 
		{
			"receive.Feedback": 0.5
		});
		
		
		
		n.get("rcontainer").set("Bypassed", receiveContainer[1]);
		n.get("scontainer").set("Bypassed", sendContainer[1]);
		
		local t = TestFramework.createTest(TestData.Impulse4096);
		
		n.get("send").set("Connection", "receive");
		
		for(s in specsToTest)
		{
			t.setProcessSpecs(s[0], s[1], s[2]);
	
			TestFramework.run();
				
			if(expectedException.length == 0)
			{
				TestFramework.assertNoException();
			}
			else
			{
				local e = t.getLastTestException();
				local ok = e.indexOf(expectedException) != -1;
				//Console.print(e);
					
				TestFramework.assertEquals(ok, true, expectedException + " not thrown");
			}
		}
		
		TestFramework.flush();
	}
	
	
	//testExceptions(["chain", false], 			["chain", false], "");
	//testExceptions(["modchain", false], 		["chain", false], "mismatch");
	//testExceptions(["fix32_block", false], 		["fix8_block", false], "Blocksize mismatch");
	//testExceptions(["fix32_block", false], 		["fix32_block", false], "");
	//testExceptions(["modchain", false], 		["modchain", false], "");
	//testExceptions(["oversample2x", false], 	["chain", false], "Samplerate mismatch");
	//testExceptions(["oversample2x", false], 	["modchain", false], "mismatch");
	
	//testExceptions(["oversample2x", true], 		["chain", false], "");
}




