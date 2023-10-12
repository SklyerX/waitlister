### Test

[DEMO](https://waitlister.skylerx.ir)

---

### Requests

When trying to subscribe a user to your waitlist you must provide the `project-id` in the headers as `x-project-id` and the `project-secret` in the headers as `x-project-secret`.

However, if you are sending the request from a trusted domain (set in the domains tab) you wont need the `project-secret`

---

### Subscribe a user

```js
const waitlist = 'WAITLIST ID';
const email = 'janesmith@example.com';
const name = 'Jane Smith'; // Optional
const phone = '555-555-5555'; // Optional
const referredBy = 'abc123'; // Optional
const metadata = { userId: 'abcd' }; // Optional

/* With client-side JavaScript, you don't need the API Key
 * if you call the endpoint from a whitelisted domain. This
 * way, you don't need to expose your API Key to the public.
 */
try {
  const response = await fetch('https://waitlister.skylerx.ir/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': waitlist
    },
    body: JSON.stringify({
      email,
      name,
      phone,
      referredBy,
      metadata,
    }),
  });

  const body = (await response.json()) as { message: string };

  if (!response.ok) {
    throw new Error(body.message);
  }

  window.alert('You have been subscribed!');
} catch (error) {
  window.alert(error.message);
}

```

### Get subscribers

```js
const axios = require("axios");

const projectId = "PROJECT ID",
  projectSecret = "sk_PROJECT_SECRET";

let config = {
  method: "GET",
  url: "https://waitlister.skylerx.ir/api/projects/subscribers",
  headers: {
    "x-project-id": projectId,
    "x-project-secret": projectSecret,
  },
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
```
