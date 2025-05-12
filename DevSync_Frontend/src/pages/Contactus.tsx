import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Get in <span className="text-emerald-500">Touch</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                    Have questions about DevSync? Our team is here to help. Reach out to us and we'll get back to you as soon as
                    possible.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-gray-800 bg-gray-900/50">
                    <CardHeader>
                        <CardTitle className="text-2xl">Contact Information</CardTitle>
                        <CardDescription>Reach out to us through any of these channels or fill out the form.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-gray-400">support@devsync.com</p>
                                <p className="text-gray-400">sales@devsync.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Phone</h3>
                                <p className="text-gray-400">+1 (555) 123-4567</p>
                                <p className="text-gray-400">Mon-Fri, 9am-5pm PT</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Office</h3>
                                <p className="text-gray-400">123 Tech Street</p>
                                <p className="text-gray-400">San Francisco, CA 94107</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Live Chat</h3>
                                <p className="text-gray-400">Available on our website</p>
                                <p className="text-gray-400">24/7 for Premium users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                    <CardHeader>
                        <CardTitle className="text-2xl">Send us a Message</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" placeholder="John" className="border-gray-700 bg-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" placeholder="Doe" className="border-gray-700 bg-gray-800" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" className="border-gray-700 bg-gray-800" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select>
                                    <SelectTrigger className="border-gray-700 bg-gray-800">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General Inquiry</SelectItem>
                                        <SelectItem value="support">Technical Support</SelectItem>
                                        <SelectItem value="sales">Sales Question</SelectItem>
                                        <SelectItem value="billing">Billing Issue</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="How can we help you?"
                                    className="min-h-32 border-gray-700 bg-gray-800"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-500 text-black hover:bg-emerald-600">
                                Send Message
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-16 rounded-lg border border-gray-800 bg-gray-900/50 p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                    <p className="mt-2 text-gray-400">Find quick answers to common questions about DevSync.</p>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <FaqItem
                        question="How do I get started with DevSync?"
                        answer="Sign up for a free account, create your first project, and invite your team members. Our onboarding wizard will guide you through the process."
                    />
                    <FaqItem
                        question="Is there a free plan available?"
                        answer="Yes, we offer a free plan with basic features for individuals and small teams. For more advanced features, check out our premium plans."
                    />
                    <FaqItem
                        question="Can I integrate DevSync with my existing tools?"
                        answer="DevSync integrates with popular tools like GitHub, GitLab, Jira, Slack, and many more."
                    />
                    <FaqItem
                        question="How secure is my code on DevSync?"
                        answer="We take security seriously. Your code is encrypted at rest and in transit, and we offer features like 2FA and SSO for enhanced security."
                    />
                </div>
            </div>
        </div>
    )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h3 className="text-lg font-medium">{question}</h3>
            <p className="mt-2 text-gray-400">{answer}</p>
        </div>
    )
}
