namespace ConvolutionTest
{
	const var n = TestFramework.reset("convolution", 
	{
		FactoryPath: "filters.convolution", ID: "conv"
	}, 
	{});

	Engine.loadAudioFilesIntoPool();

	TestFramework.loadAudioFile("conv", "one_dirac_delayed.wav");

	const var t = TestFramework.createTest(TestData.Impulse4096);

	const var b = TestFramework.run();;

	TestFramework.assertEquals(b[512], 0.5, "impulse not delayed");

	t.setProcessSpecs(1, 96000.0, 512);

	const var b2 = TestFramework.run();

	TestFramework.assertSimilar(b2[1119], 0.5, "96k impulse not delayed properly");


	TestFramework.loadAudioFile("conv", "one_dirac.wav");

	inline function samples2ms(s)
	{
		return s / 44.1;
	}

	const var t2 = TestFramework.createTest(TestData.Impulse4096);
	t2.setProcessSpecs(1, 44100.0, 128);
	n.setParameterDataFromJSON({"conv.Predelay": samples2ms(2048) });
	const var b4 = TestFramework.run();
	TestFramework.assertEquals(b4[2048], 0.5, "predelay doesn't work");

	TestFramework.flush();

}

