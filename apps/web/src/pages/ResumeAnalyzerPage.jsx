import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

const ResumeAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a PDF or DOCX file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload a file first');
      return;
    }

    setLoading(true);
    try {
      // Simulated analysis
      setTimeout(() => {
        setAnalysis({
          score: 78,
          atsCompatibility: 'Good',
          missingKeywords: ['leadership', 'project management', 'agile'],
          suggestions: [
            'Add more quantifiable achievements',
            'Include relevant keywords from job description',
            'Improve formatting for ATS compatibility',
          ],
        });
        setLoading(false);
        toast.success('Analysis complete');
      }, 2000);
    } catch (error) {
      toast.error('Analysis failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Resume Analyzer - UselessAI</title>
        <meta name="description" content="Analyze your resume with AI." />
      </Helmet>

      <DashboardLayout>
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Resume Analyzer</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Upload your resume (PDF or DOCX)</p>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                {file && <p className="mt-4 text-sm">Selected: {file.name}</p>}
              </div>
              <Button onClick={handleAnalyze} disabled={loading || !file} className="w-full mt-4">
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Overall Score</span>
                    <span className="text-2xl font-bold">{analysis.score}/100</span>
                  </div>
                  <Progress value={analysis.score} />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">ATS Compatibility</h3>
                  <p className="text-muted-foreground">{analysis.atsCompatibility}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword) => (
                      <span key={keyword} className="px-3 py-1 bg-muted rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Suggestions</h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ResumeAnalyzerPage;
