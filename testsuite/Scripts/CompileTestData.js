namespace CompileTestData
{
	const var SOLO_TEST = "";
	
	const var Data = 
	{
		"compile_test01":
		{
			"Signal": TestData.Empty512,
			"Specs": [2, 44100.0, 512],
			"Parameters":
			{
				"compiled_node.Frequency": 160,
				"compiled_node.Gain": -6.0
			}
		},
		"compile_test02":
		{
			"Signal": TestData.Empty8192,
			"Specs": [ 2, 44100.0, 128],
			"Parameters":
			{
				"compiled_node.RampTime": 0.018
			}
		},
		"compile_test03":
		{
			"Signal": TestData.Static4096,
			"Specs": [2, 44100.0, 4096],
			"Parameters":
			{
				"compiled_node.Balance": 0.25
			}
		},
		"compile_test04":
		{
			"Signal": TestData.Empty8192,
			"Specs": [2, 44100.0, 4096],
			"Parameters": {},
			"preInterpretedCallback": function(n) { Engine.setHostBpm(80.0); },
			"preCompileCallback": function(n) { Engine.setHostBpm(80.0); }
		},
		"compile_test05":
		{
			"Signal": TestData.Empty512,
			"Specs": [ 2, 44100.0, 512],
			"Parameters": { "compiled_node.Parameter": 0.2 }
		},
		"compile_test06":
		{
			"Signal": TestData.Ramp8192,
			"Specs": [ 2, 44100.0, 512],
			"Parameters": {}
		},
		"compile_test07":
		{
			"Signal": TestData.OneKhzSine4096,
			"Specs": [ 2, 44100.0, 512],
			"Parameters": {}
		}
	};
}