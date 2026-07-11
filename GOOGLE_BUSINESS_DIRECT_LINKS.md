# Google Business Profile Direct Links

These URLs send Google Business Profile visitors to the most relevant WSC page and identify the action in analytics. Google may show only the link types enabled for the profile's selected categories.

## Primary website link

- Website: `https://www.woodinvillesportsclub.com/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=website`

## Booking and action links

- Book a tennis court: `https://www.woodinvillesportsclub.com/tennis?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=book_tennis`
- Book pickleball: `https://www.woodinvillesportsclub.com/pickleball?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=book_pickleball`
- Book a golf simulator: `https://www.woodinvillesportsclub.com/golf?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=book_golf_simulator`
- Request a golf lesson: `https://www.woodinvillesportsclub.com/golf-coaching?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=book_golf_lesson`
- Request personal training: `https://www.woodinvillesportsclub.com/personal-training-interest-form?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=book_personal_training`
- Register for summer programs: `https://www.woodinvillesportsclub.com/summer?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=register_summer_program`
- Explore memberships: `https://www.woodinvillesportsclub.com/membership?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=join_membership`
- Request a private event: `https://www.woodinvillesportsclub.com/events?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=request_private_event`

## Implementation notes

- Set the WSC-owned destination as preferred when Google offers multiple links for the same action.
- Keep CourtReserve as the final booking provider on each applicable landing page.
- Do not use the membership cancellation page, newsletter page, social profiles, or a URL shortener as a Google action link.
- After deployment, confirm `google / organic` traffic and `google_business_profile` campaigns in GA4. CourtReserve exits are recorded as `booking_click` events after analytics consent.
