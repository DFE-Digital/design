---
category: Standards
expires: 2020-12-01
---

# DfE design standards

The Department for Education is responsible for children’s services and education, including early years, schools, higher and further education policy, apprenticeships and wider skills in England. 

DfE's transformationals aims inform how we deliver.
-   Put children and learners first
-   Deliver joined up results
-   Empower yourself and others
-   Be data, evidence and expertise driven

DfE services are designed to meet user needs and to protect the environment.


All DfE's online services must:

-   Be designed to meet the Government [service standard](https://www.gov.uk/service-manual/service-standard)

-   Meet the [government accessibility requirements](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction#meeting-government-accessibility-requirements)

-   Be designed based on user needs

## Non-GOV.UK domains

Services and websites hosted on non-GOV.UK domain names must still meet the government [service standard](https://www.gov.uk/service-manual/service-standard).

All public-facing services should look and feel like part of GOV.UK, so users know they're in the right place.

Non-GOV.UK domains should not use the:

-   'New Transport' font
-   GOV.UK Header or crown logo
-   GOV.UK footer

### Font

Use the Helvetica or Arial CSS font stacks.

### Colour

Colours should be consistent with the [GOV.UK front end kit](https://design-system.service.gov.uk/styles/colour/). 

Agency or department colours can be used sparingly, for example in headers or navigation.

You must make sure that the contrast ratio of text and interactive elements in
your service meets [level AA of the Web Content Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/TR/WCAG21/#contrast-minimum).


### Header and Footer

DfE or supporting agency page templates should be used in place of the GOV.UK templates for:

-   internal facing services (case management systems, intranets etc)
-   external facing services not hosted on GOV.UK

Example images to be added...

### Logo

For external facing sites not on Gov.uk a DfE or supporting agency logo must be used.

Organisation logos must be included as an SVG where possible. The crest image itself must be presentational and ignored by screen readers.

Links in the logo must:

-   accept focus
-   be focusable with a keyboard
-   be usable with a keyboard
-   indicate when they have focus
-   change in appearance when touched (in the touch-down state)
-   change in appearance when hovered
-   be usable with touch
-   be usable with [voice commands](https://www.w3.org/WAI/perspectives/voice.html)
-   have visible text
-   have meaningful text

[View the organisation logo component](https://components.publishing.service.gov.uk/component-guide/organisation_logo)

[View the component CSS](https://github.com/alphagov/govuk_publishing_components/blob/master/app/assets/stylesheets/govuk_publishing_components/components/_organisation-logo.scss)

-------------

## Cookies and similar technologies

To comply with the Privacy and Electronic Communications Regulations (PECR) you must:

-   tell people if your site uses cookies or similar technologies
-   clearly explain what the cookies do and why
-   not store cookies for longer than is necessary  
-   get a user's explicit consent before storing or retrieving non-essential cookies on their device
-   save a user's consent preferences for 1 year only
-   not store any unique identifiers in the consent preferences cookie

A user must be able to:

-   withdraw consent as easily as they give it
-   make changes to their cookie settings
-   use the service without consenting to the use of cookies

[Read the full compliance guidance document](/Cookies-and-similar-technologies.md)

-------------

## Inclusive design

All DfE services must be designed to be inclusive. Inclusive design aims to remove barriers that create extra effort for some groups of users.

In general, inclusive design lets everyone participate equally, confidently and independently in everyday activities.

Principles of inclusive design:

-   inclusive -- so everyone can use it safely, easily and with dignity
-   responsive -- taking account of what people say they need and want
-   flexible -- so different people can use it in different ways
-   convenient -- so everyone can use it without too much effort or separation
-   accommodating for all people, regardless of their age, gender, mobility, ethnicity or circumstances
-   welcoming -- with no disabling barriers that might exclude some people
-   realistic -- offering more than one solution to help balance everyone's needs and recognising that one solution may not work for all

-------------

## Accessibility

Making a website or mobile app accessible means making sure it can be used by everyone, including those with:

-   impaired vision
-   motor difficulties
-   cognitive impairments or learning disabilities
-   deafness or impaired hearing

[Public Sector Body Accessibility Regulations 2018](http://www.legislation.gov.uk/uksi/2018/852/contents/made) became UK law in September 2018, meaning public sector organisations have a legal duty to make sure websites and apps meet accessibility requirements.

To meet accessibility requirements, digital services must:

-   meet level AA of the  [Web Content Accessibility Guidelines (known as WCAG 2.1)](https://www.gov.uk/service-manual/helping-people-to-use-your-service/understanding-wcag-20)  as a minimum
-   work on the most commonly used [assistive technologies](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies) -- including screen magnifiers, screen readers and speech recognition tools
-   include people with disabilities in [user research](https://www.gov.uk/service-manual/user-research/running-research-sessions-with-people-with-disabilities)
-   publish an accessibility statement that explains how accessible your website or mobile app is

### WCAG standards

WCAG stands for Web Content Accessibility Guidelines and is the standard by which accessibility is measured regardless of whether the digital service is a website, product or app.

WCAG 2.1 is an extension to WCAG 2.0. To be accessible, the guidelines say, services must be:

-   perceivable - designed in ways that can be accessed by everyone
-   Operable - designed in ways that can be operated by everyone
-   Understandable - designed in ways that can be understood by everyone
-   Robust - reliable and compatible with assistive technology and standards

### Testing a service

All services must be manually tested against the WCAG 2.1 criteria.

[View the DfE accessibility checklist](https://drive.google.com/file/d/1I9l_ImXjJMpR3tZY-1lN63Rub6SK2tdq/view?usp=sharing)[ ](https://www.gov.uk/government/publications/sample-accessibility-statement/sample-accessibility-statement-for-a-fictional-public-sector-website#technical-information-about-this-websites-accessibility)

Automated tools are available but tools alone are not able to to identify all accessibility issues. See the GDS accessibility team’s [audit of the most used accessibility tools](https://alphagov.github.io/accessibility-tool-audit/).


### Accessibility statements

All public sector websites will need to publish an accessibility statement. The accessibility statement should:

-   list any inaccessible parts of the website or app
-   show how people with access needs can get alternatives to content that's not accessible
-   provide details on who to contact to report accessibility issues
-   provide information on the enforcement procedure if people are not happy with the response
-   be published in a fully accessible form and comply with the [GOV.UK style guide](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style)
-   follow a consistent format

[View a sample accessibility statement](https://www.gov.uk/government/publications/sample-accessibility-statement/sample-accessibility-statement-for-a-fictional-public-sector-website#technical-information-about-this-websites-accessibility)


###  Testing with assistive technologies

All DfE services must work with common assistive technologies.

This means:

* testing with assistive technology 

* finding user research participants who use assistive technology

* asking for assistive technology testing to be included in your accessiblity audit


### Getting an accessibility audit

You must get an [accessibility audit](https://www.gov.uk/service-manual/helping-people-to-use-your-service/getting-an-accessibility-audit) and fix any issues before a service can move into public beta.  

-------------

## Maps 

All essential geographic information must be available in non visual formats such as text or lists.

Maps should be used as visual enhancements of this information for people who choose to use them.

Interactive maps should only be used when there is a user need.

[Read the full guidance on working with maps](/Maps.md)

-------------

## Data visualisation


All essential data and information must be available in non visual formats such as text or lists.

Charts and graphs should be used as visual enhancements of this information for people who chose to use them.

<!-- Read the full guidance on working with maps (coming soon) -->

-------------

## Internal services

Internal facing services and case management tools need to be consistent across DfE.

Standardisation increases usability and familiarity, making systems more efficient, easy to use and accessible. 

### Procurement

Any products bought from external suppliers need to meet the [Technology code of practice](https://www.gov.uk/government/publications/technology-code-of-practice/technology-code-of-practice)

<!-- Read the full guidance on case management systems (coming soon) -->

-------------

## Components and patterns

Design patterns solve common problems so teams can focus on the things unique to their service and its users.

Check the [GOV.UK Design System](https://design-system.service.gov.uk/) to see if the component or pattern you need is already being in government.

If you cannot find what you need in the GOV.UK Design System you can:

1.  [see if it is being worked on by other teams across government ](https://design-system.service.gov.uk/community/backlog/)and add your findings

2.  [see if it is being worked on by someone in DfE](https://github.com/DfE/design-discussions/issues) and add your findings

3.  Check other departments for [design patterns and design resources](https://github.com/ctdesign/gov-design-systems-list)

4.  [propose a new pattern in the DfE backlog](https://github.com/DfE/design-discussions/issues)

5.  [propose a new pattern in the GOV.UK Design System](https://design-system.service.gov.uk/community/propose-a-component-or-pattern/)

All patterns must be [useful and unique](https://design-system.service.gov.uk/community/contribution-criteria/#new-proposals).

### Iterating a component or pattern

Existing design patterns can be used as starting points but may need to be iterated to suit the needs of users of a particular service.

Before iterating a component or pattern make sure there is a clear user need to do so. Share any changes you make or research findings to the [GOV.UK design system backlog](https://github.com/alphagov/govuk-design-system-backlog/issues).

To do this add a class to the component with a DfE namespace.

#### Default

```

<button type="submit" class="govuk-button">

  Save and continue

</button>

```

#### New

```

<button type="submit" class="govuk-button DfE-button">

  Save and continue

</button>

```

### New components

To create a new pattern, use a DfE namespace to avoid issues with CSS inheritance.

```

<header role="banner" class="DfE-internal-header">

   <div class="DfE-logo">

       <a href="#" title="#" class="DfE-logo__link">

           <span class="c-DfE-logo__title"> Logo text</span>

       </a>

   </div>

   <div class="DfE-internal-service-name">

       <a href="/" title="Go to the homepage" class="DfE-internal-service-name__link">

         Internal service name

       </a>

   </div>

</header>

```
