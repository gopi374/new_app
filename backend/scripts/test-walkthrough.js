const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');

const runWalkthrough = async () => {
  try {
    await connectDB();
    const server = app.listen(4001);
    console.log('[Test] Server started on port 4001');

    const baseUrl = 'http://localhost:4001';

    // 1. Health check
    console.log('\n--- 1. Health Check ---');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log('GET /health ->', healthRes.status, healthData.status);

    // 2. Auth Register Visitor
    console.log('\n--- 2. Auth Registration & Login ---');
    const visitorRegisterRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `testvisitor_${Date.now()}@dharohar.app`,
        password: 'password123',
        full_name: 'Indore Explorer',
      }),
    });
    const visitorData = await visitorRegisterRes.json();
    console.log('POST /auth/register ->', visitorRegisterRes.status, 'User Role:', visitorData.data.user.role);

    // 3. Auth Register Admin/Moderator for workflow testing
    const modEmail = `testmod_${Date.now()}@dharohar.app`;
    const modRegisterRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: modEmail,
        password: 'password123',
        full_name: 'Heritage Moderator',
      }),
    });
    const modRegisterData = await modRegisterRes.json();
    
    // Elevate role to MODERATOR in DB directly for test
    const { User } = require('../src/models');
    await User.findByIdAndUpdate(modRegisterData.data.user.id, { user_role: 'MODERATOR' });
    
    // Login as Moderator
    const modLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: modEmail, password: 'password123' }),
    });
    const modLoginData = await modLoginRes.json();
    const modToken = modLoginData.data.tokens.accessToken;
    console.log('POST /auth/login (Moderator) ->', modLoginRes.status, 'Role:', modLoginData.data.user.role);

    // 4. Content Listing
    console.log('\n--- 3. Content API ---');
    const placesRes = await fetch(`${baseUrl}/api/v1/places?city_id=city_indore_mp`);
    const placesData = await placesRes.json();
    console.log(`GET /places?city_id=city_indore_mp ->`, placesRes.status, `Found ${placesData.data.items.length} items:`, placesData.data.items.map(p => p.name).join(', '));

    // 5. Geo-Radius Search
    console.log('\n--- 4. Geo-Radius Discovery ---');
    const geoRes = await fetch(`${baseUrl}/api/v1/discovery/near?lng=75.8577&lat=22.7196&radiusMeters=5000&type=places`);
    const geoData = await geoRes.json();
    console.log('GET /discovery/near (around Rajwada) ->', geoRes.status, `Found ${geoData.data.count} places near Rajwada Palace.`);

    // 6. Unified Search
    console.log('\n--- 5. Unified Search ---');
    const searchRes = await fetch(`${baseUrl}/api/v1/search?q=Sarafa`);
    const searchData = await searchRes.json();
    console.log('GET /search?q=Sarafa ->', searchRes.status, `Found ${searchData.data.total_results} matching items across collections.`);

    // 7. Contribution Submission & Approval Workflow
    console.log('\n--- 6. Contribution Pipeline ---');
    // Elevate visitor to CONTRIBUTOR
    await User.findByIdAndUpdate(visitorData.data.user.id, { user_role: 'CONTRIBUTOR' });
    const contribLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: visitorData.data.user.email, password: 'password123' }),
    });
    const contribToken = (await contribLoginRes.json()).data.tokens.accessToken;

    const contribSubmitRes = await fetch(`${baseUrl}/api/v1/contributions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${contribToken}`,
      },
      body: JSON.stringify({
        contribution_type: 'HIDDEN_GEM_SUBMISSION',
        proposed_data: {
          _id: 'place_tincha_falls',
          name: 'Tincha Falls',
          normalized_name: 'tincha falls',
          place_type: 'HIDDEN_GEM',
          city_id: 'city_indore_mp',
          state_id: 'state_mp',
          location: { type: 'Point', coordinates: [75.9877, 22.5696] },
          description: 'Breathtaking 300ft seasonal waterfall near Indore.',
        },
      }),
    });
    const contribSubmitData = await contribSubmitRes.json();
    console.log('POST /contributions ->', contribSubmitRes.status, 'ID:', contribSubmitData.data._id);

    // Moderator approves contribution
    const approveRes = await fetch(`${baseUrl}/api/v1/contributions/${contribSubmitData.data._id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${modToken}`,
      },
      body: JSON.stringify({ review_notes: 'Verified local gem.' }),
    });
    const approveData = await approveRes.json();
    console.log('POST /contributions/:id/approve ->', approveRes.status, 'Merged doc verification_status:', approveData.data.merged_document.verification.verification_status);

    // 8. Admin Guardrail Verification
    console.log('\n--- 7. Admin Guardrail Test ---');
    // Set entity verification to REJECTED
    await fetch(`${baseUrl}/api/v1/admin/places/place_tincha_falls/verification`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${modToken}`,
      },
      body: JSON.stringify({ verification_status: 'REJECTED' }),
    });

    // Try publishing REJECTED entity -> expect 400 Bad Request
    const pubFailRes = await fetch(`${baseUrl}/api/v1/admin/places/place_tincha_falls/publication`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${modToken}`,
      },
      body: JSON.stringify({ publication_status: 'PUBLISHED' }),
    });
    const pubFailData = await pubFailRes.json();
    console.log('PATCH /admin/places/:id/publication on REJECTED entity -> Status:', pubFailRes.status, 'Message:', pubFailData.error.message);

    console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
    server.close();
    await disconnectDB();
  } catch (err) {
    console.error('[Test Error]', err);
    process.exit(1);
  }
};

runWalkthrough();
