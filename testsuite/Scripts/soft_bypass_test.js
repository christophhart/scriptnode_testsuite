const var n = TestFramework.reset("testing softbypass", {
	FactoryPath: "container.soft_bypass", ID: "bp",
	Nodes: [
	{ FactoryPath: "math.add", ID: "add"}
	]
},
{
	"mul.Value": 1.0,
	"add.Value": 1.0,
	"conv.Gate": 0.0
});

TestFramework.createRootParameter("SoftBypass", 0.3);

n.get("bp").connectToBypass("dsp.SoftBypass");

TestFramework.createTest(TestData.Empty512);

reg r = TestFramework.run();

TestFramework.assertEquals(r[0], 0.0, "SoftBypass value not retained after connection");

const var t = TestFramework.createTest({
  "NodeId": "dsp",
  "SignalType": "Empty",
  "SignalLength": 8192,
  "ParameterEvents": [
    {
      "Index": 0,
      "Value": 0.0,
      "Timestamp": 0
    },
    {
      "Index": 0,
      "Value": 1.0,
      "Timestamp": 4000
    }
  ]
});

r = TestFramework.run();

TestFramework.assertEquals(r[0], 0.0, "start not empty");
TestFramework.assertEquals(r[3999], 0.0, "v2 not empty");
TestFramework.assertSimilar(r[4445],  0.50, "not half");
TestFramework.assertEquals(r[5000], 1.0, "v3 is empty");

t.setProcessSpecs(1, 96000.0, 256);
TestFramework.assertSimilar(TestFramework.run()[4965],  0.50, "different samplerate half position");

t.setProcessSpecs(1, 44100.0, 128);
TestFramework.assertSimilar(TestFramework.run()[4445],  0.50, "same half position with different blocksize");

TestFramework.flush();