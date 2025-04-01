---
layout: archive
permalink: /
title: "Saloni Gandhi"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---
<style>
:root {
  --link-color: #00a6a6;
  --line-gray: #888;
}

/* Shared heading style */
.section-title {
  font-size: 1.35rem;
  font-weight: 700;
   color: #484D52; 
  margin-top: 2.5rem;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Work Experience Title */
.work-title::before {
  content: "🧑‍💻";
}

/* Technical Skills Title */
.tech-title::before {
  content: "🛠️";
}

/* Timeline line and dots */
.timeline {
  border-left: 2.5px solid var(--line-gray);
  padding-left: 1.3rem;
  margin-bottom: 2rem;
}
.timeline-entry {
  position: relative;
  margin-bottom: 1.5rem;
}
.timeline-entry::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 4px;
  width: 9px;
  height: 9px;
  background: var(--line-gray);
  border-radius: 50%;
}
.timeline-entry span {
  display: block;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.2rem;
}
.timeline-entry a {
  color: var(--link-color);
  text-decoration: underline;
}
.skills-block {
  margin-bottom: 1rem;
  font-size: 0.95rem; /* match timeline-entry size */
  line-height: 1.6;
}  
</style>

<p>
I am a graduate student pursuing a Master of Science in Computer Science at the 
<a href="https://bloomington.iu.edu" target="_blank" style="color: #3BA3A5; font-weight: 500;">Indiana University Bloomington</a>. 
With a strong background in software development and a passion for building reliable, scalable systems. 
As a Software Engineer at UBS, I designed automation frameworks, improved system performance, and created tools used by teams across seven countries.
</p>

<p>
I’ve worked on a variety of projects, including an AI-based tool for detecting eye diseases, a language converter that transforms C code into Java and Python, and dashboards that simplify complex financial data. I enjoy breaking down problems, writing clean code, and learning new technologies as I go.
</p>

<p>
Outside of tech, I’m a national speedball player, which has taught me teamwork, focus, and discipline.
</p>

<!-- Work Experience Section -->
<h2 class="section-title">🧑‍💻 Work Experience</h2>
<div class="timeline">
  <div class="timeline-entry">
    <span>Jul 2022 – Jul 2024</span>
    <div>Software Engineer @ <a href="https://www.ubs.com/global/en.html" target="_blank">UBS</a></div>
  </div>
  <div class="timeline-entry">
    <span>Jan 2022 – Jun 2022</span>
    <div>Software Co-op @ <a href="https://www.ubs.com/global/en.html" target="_blank">UBS</a></div>
  </div>
  <div class="timeline-entry">
    <span>Jun 2021 – Aug 2021</span>
    <div>Software Intern @ <a href="https://www.ubs.com/global/en.html" target="_blank">UBS</a></div>
  </div>
  <div class="timeline-entry">
    <span>Apr 2020 – Nov 2020</span>
    <div>Software Intern @ <a href="http://www.unipune.ac.in/" target="_blank">Savitribai Phule Pune University</a></div>
  </div>
</div>

<!-- Technical Skills -->
<h2 class="section-title">🛠️ Technical Skills</h2>
<div class="skills-block"><strong>Languages/Frameworks:</strong> C/C++, Python, Java, JavaScript, Bash, Shell, Vue.js, Django, Flask, Node.js, LangChain</div>
<div class="skills-block"><strong>Databases:</strong> PostgreSQL, MySQL, SQLite, MongoDB, Cassandra, Redis, DynamoDB</div>
<div class="skills-block"><strong>Tools & Libraries:</strong> Git, GitHub, Linux, Elasticsearch, Visual Studio, Postman, Swagger, Power BI, Tableau, Selenium, Jira</div>
<div class="skills-block"><strong>Cloud & DevOps:</strong> Azure, AWS (EC2, S3, ECR, ECS, RDS, Lambda, CloudWatch, Glue), GitHub Actions, Docker, Kubernetes</div>
<div class="skills-block"><strong>AI & ML:</strong> PyTorch, TensorFlow, Scikit, Pandas, NumPy, Matplotlib, Hugging Face, Transformers, LLM, NLP, CV, Gen AI</div>
<div class="skills-block"><strong>Other:</strong> Backend, Distributed Systems, Debugging, Agile, SDLC, Data Analysis, Data Visualization, AI Integration</div>
