# Deploying Bhagavad Gita Chatbot to Netlify

This document provides instructions for deploying the Bhagavad Gita Chatbot application to Netlify.

## Prerequisites

- A Netlify account
- Git repository with your project code
- Node.js and npm installed locally

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository includes:
- All source code
- `package.json` with dependencies
- `netlify.toml` configuration file
- `.env.example` file (if applicable)

### 2. Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select the Bhagavad Gita Chatbot repository

### 3. Configure Build Settings

Netlify should automatically detect that this is a Next.js project and configure the build settings accordingly. However, verify the following settings:

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js version: 18.x (or higher)

### 4. Environment Variables

Add the following environment variables in the Netlify UI (Site settings > Build & deploy > Environment):

\`\`\`
NEXT_PUBLIC_SITE_URL=https://your-netlify-site-url.netlify.app
\`\`\`

Add any other environment variables required by your application.

### 5. Deploy

Click "Deploy site" to start the deployment process. Netlify will:
1. Clone your repository
2. Install dependencies
3. Build your Next.js application
4. Deploy the site to their CDN

### 6. Custom Domain (Optional)

To use a custom domain:
1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

### 7. Continuous Deployment

Netlify automatically sets up continuous deployment. Any changes pushed to your main branch will trigger a new build and deployment.

## Troubleshooting

### Build Failures

If your build fails, check:
- Build logs for specific errors
- Ensure all dependencies are correctly listed in package.json
- Verify environment variables are correctly set

### API Routes Not Working

If your API routes aren't working:
- Ensure the Netlify Next.js plugin is correctly installed
- Check that your API routes follow Next.js conventions

### Performance Issues

If you experience performance issues:
- Enable Incremental Static Regeneration where appropriate
- Consider using Netlify Edge Functions for dynamic content

## Additional Resources

- [Netlify Next.js Plugin Documentation](https://github.com/netlify/netlify-plugin-nextjs)
- [Next.js on Netlify Documentation](https://docs.netlify.com/integrations/frameworks/next-js/overview/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)

## Support

For issues related to deployment, consult the Netlify support documentation or contact Netlify support.
