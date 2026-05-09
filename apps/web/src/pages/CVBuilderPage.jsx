import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const CVBuilderPage = () => {
  const [cvData, setCvData] = useState({
    title: '',
    personalInfo: { name: '', email: '', phone: '' },
    summary: '',
    experience: '',
    education: '',
    skills: '',
    template: 'modern',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await pb.collection('cvs').create({
        title: cvData.title,
        content: cvData,
        template: cvData.template,
      }, { $autoCancel: false });
      toast.success('CV saved successfully');
    } catch (error) {
      toast.error('Failed to save CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>CV Builder - UselessAI</title>
        <meta name="description" content="Create professional CVs." />
      </Helmet>

      <DashboardLayout>
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">CV Builder</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CV Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">CV Title</label>
                    <Input
                      value={cvData.title}
                      onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                      placeholder="My Professional CV"
                      className="text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Template</label>
                    <Select value={cvData.template} onValueChange={(value) => setCvData({ ...cvData, template: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Professional Summary</label>
                    <Textarea
                      value={cvData.summary}
                      onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                      rows={4}
                      className="text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Work Experience</label>
                    <Textarea
                      value={cvData.experience}
                      onChange={(e) => setCvData({ ...cvData, experience: e.target.value })}
                      rows={6}
                      className="text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Education</label>
                    <Textarea
                      value={cvData.education}
                      onChange={(e) => setCvData({ ...cvData, education: e.target.value })}
                      rows={4}
                      className="text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Skills</label>
                    <Textarea
                      value={cvData.skills}
                      onChange={(e) => setCvData({ ...cvData, skills: e.target.value })}
                      rows={3}
                      className="text-foreground"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={loading} className="flex-1">
                      {loading ? 'Saving...' : 'Save CV'}
                    </Button>
                    <Button variant="outline">Export PDF</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-6 min-h-[600px]">
                    <p className="text-muted-foreground text-center">CV preview will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CVBuilderPage;
