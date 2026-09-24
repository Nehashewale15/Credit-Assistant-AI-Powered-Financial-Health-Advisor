import urllib.request
import json

def post(url, data, headers={}):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', **headers}, method='POST')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def put(url, data, headers={}):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', **headers}, method='PUT')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get(url, headers={}):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def run_tests():
    print('=== 1. SCENARIO 1: REGISTER & PROFILE SETUP ===')
    reg = post('http://127.0.0.1:8000/api/auth/register', {
        'name': 'Test Student',
        'email': 'integration_test_user_unique2@example.com',
        'password': 'testpassword123'
    })
    token = reg['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print('Registered successfully! Token received for:', reg['user_name'])

    profile_data = {
        'credit_score': 640,
        'monthly_income': 50000.0,
        'monthly_expenses': 20000.0,
        'monthly_debt': 15000.0,
        'credit_limit': 150000.0,
        'outstanding_credit': 90000.0,
        'missed_payments': 0,
        'financial_goal': 'Reduce debt'
    }
    p1 = post('http://127.0.0.1:8000/api/financial-profile', profile_data, headers)
    print(f"Profile Created! DTI: {p1['dti']}% | Utilization: {p1['utilization']}% | Available: INR {p1['available_credit']}")
    assert p1['dti'] == 30.0, 'DTI calculation error'
    assert p1['utilization'] == 60.0, 'Utilization calculation error'

    print('\n=== 2. SCENARIO 2: GEMINI AI ADVISOR & CHAT ===')
    ai_res = post('http://127.0.0.1:8000/api/ai/analyze', {'force_refresh': True}, headers)
    print('AI Summary:', ai_res['summary'][:120], '...')
    print('AI 5-Step Action Plan Steps Count:', len(ai_res['action_plan']))
    assert len(ai_res['action_plan']) == 5, 'AI action plan should have exactly 5 steps'

    chat_res = post('http://127.0.0.1:8000/api/ai/chat', {'question': 'Why is my DTI high?'}, headers)
    print('AI Chat Answer:', chat_res['answer'][:120], '...')

    print('\n=== 3. SCENARIO 4: DEBT REDUCTION & METRIC RECALCULATION ===')
    profile_update = {
        'credit_score': 670,
        'monthly_income': 50000.0,
        'monthly_expenses': 20000.0,
        'monthly_debt': 10000.0,
        'credit_limit': 150000.0,
        'outstanding_credit': 60000.0,
        'missed_payments': 0,
        'financial_goal': 'Reduce debt'
    }
    p2 = put('http://127.0.0.1:8000/api/financial-profile', profile_update, headers)
    print(f"Updated Profile! New DTI: {p2['dti']}% | New Utilization: {p2['utilization']}%")
    assert p2['dti'] == 20.0, 'New DTI calculation error'
    assert p2['utilization'] == 40.0, 'New Utilization calculation error'

    dash = get('http://127.0.0.1:8000/api/dashboard', headers)
    print('Dashboard Score Snapshots Count:', len(dash['score_history']))
    print('Latest Delta:', dash['delta'])
    assert dash['delta']['score_change'] == 30, 'Score delta calculation error'

    print('\n=== 4. DEMO MODE TEST (Aarav Sharma) ===')
    demo = post('http://127.0.0.1:8000/api/auth/demo', {})
    demo_headers = {'Authorization': f"Bearer {demo['access_token']}"}
    demo_dash = get('http://127.0.0.1:8000/api/dashboard', demo_headers)
    print(f"Demo User: {demo_dash['user_name']} | Snapshots Count: {len(demo_dash['score_history'])}")
    print('Snapshots:', [s['score'] for s in demo_dash['score_history']])
    assert len(demo_dash['score_history']) == 3, 'Demo user should have 3 historical snapshots'

    print('\n=============================================')
    print('ALL 4 CORE PROJECT SCENARIOS PASSED 100%!')
    print('=============================================')

if __name__ == '__main__':
    run_tests()
