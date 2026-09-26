-- =========================================================
-- StreetCare India — Supabase Schema
-- Run this in Supabase SQL Editor to set up all tables
-- =========================================================

-- NGOs table
create table if not exists ngos (
  id                  text primary key,
  name                text not null,
  darpan_id           text unique,
  city                text,
  state               text,
  phone               text,
  email               text,
  focus               text,
  tier                text default 'Silver',
  status              text default 'Pending',
  is_govt_verified    boolean default false,
  verification_agency text,
  mosje_empanelled    boolean default false,
  mosje_reg_no        text,
  tax_exemption       text,
  shelter_license     text,
  registered_address  text,
  nodal_officer       jsonb,
  rescue_van          jsonb,
  lat                 double precision,
  lng                 double precision,
  shelter_capacity    integer default 0,
  cases_resolved      integer default 0,
  vacancies           integer default 0,
  storage_capacity    integer default 0,
  certifications      text[],
  images              text[],
  created_at          timestamptz default now()
);

-- Reports / Cases table
create table if not exists reports (
  id              text primary key,
  person_type     text,
  estimated_age   text,
  condition       text,
  location        jsonb,
  photo           text,
  reported_at     text,
  status          text default 'Report Submitted',
  assigned_ngo    text,
  assigned_ngo_id text references ngos(id),
  reported_by     text,
  urgency         text default 'Medium',
  current_stage   integer default 0,
  timeline        jsonb,
  created_at      timestamptz default now()
);

-- NGO Registration Requests
create table if not exists ngo_registrations (
  id                  uuid primary key default gen_random_uuid(),
  ngo_name            text not null,
  darpan_id           text,
  pan                 text,
  registration_type   text,
  city                text,
  state               text,
  address             text,
  contact_person      text,
  email               text,
  phone               text,
  shelter_capacity    integer,
  has_rescue_van      boolean default false,
  has_12a_80g         boolean default false,
  focus_area          text,
  status              text default 'Pending Review',
  created_at          timestamptz default now()
);

-- Proposals (User ? NGO)
create table if not exists proposals (
  id          uuid primary key default gen_random_uuid(),
  ngo_id      text references ngos(id),
  user_name   text,
  user_phone  text,
  message     text,
  status      text default 'pending',   -- pending | accepted | rejected
  created_at  timestamptz default now()
);

-- Enable Row Level Security (allow public reads for NGOs and reports)
alter table ngos enable row level security;
alter table reports enable row level security;
alter table ngo_registrations enable row level security;
alter table proposals enable row level security;

-- RLS Policies
create policy "Public read NGOs"          on ngos            for select using (true);
create policy "Public read reports"       on reports         for select using (true);
create policy "Public insert reports"     on reports         for insert with check (true);
create policy "Public update reports"     on reports         for update using (true);
create policy "Public insert reg"         on ngo_registrations for insert with check (true);
create policy "Public insert proposals"   on proposals       for insert with check (true);
create policy "Public read proposals"     on proposals       for select using (true);
create policy "Public update proposals"   on proposals       for update using (true);

-- Seed NGOs from mock data
insert into ngos (id, name, darpan_id, city, state, phone, email, focus, tier, status, is_govt_verified, verification_agency, mosje_empanelled, mosje_reg_no, tax_exemption, shelter_license, registered_address, nodal_officer, rescue_van, lat, lng, shelter_capacity, cases_resolved, vacancies, storage_capacity, certifications)
values
('ngo-1','Atchayam Trust','TN/2016/0104829','Erode & Chennai','Tamil Nadu','+91 94877 75888','info@atchayamtrust.org','Elderly homeless & beggar rehabilitation','Gold','Verified',true,'NITI Aayog & MoSJE Govt of India',true,'MoSJE/SMILE/2021/TN-014','12A & 80G Income Tax Exempt (AACTA1289PE20214)','TN/SWD/SHL/2018/092','No. 14, Gandhi Nagar, Perundurai Road, Erode - 638011','{"name":"Dr. P. Naveen Kumar","designation":"State Nodal Director & Social Worker","phone":"+91 94877 75888"}','{"vanNumber":"TN-33-BV-4412","status":"Live on Field","driverContact":"+91 98421 88721"}',13.0827,80.2707,120,4500,18,50,ARRAY['NITI Aayog','MoSJE SMILE','12A 80G']),
('ngo-2','SPYM (Society for Promotion of Youth & Masses)','DL/2010/0034123','New Delhi','Delhi','+91 11 2689 3872','contact@spym.org','Night shelters, children & destitute adults','Gold','Verified',true,'NITI Aayog & Delhi Urban Shelter Board (DUSIB)',true,'MoSJE/SMILE/2020/DL-003','12A & 80G Validated (DEL/12A/2005-06/S-412)','DUSIB/SH/NCR/2014/108','111/9, Opposite Sector B-4, Vasant Kunj, New Delhi - 110070','{"name":"Dr. Rajesh Kumar","designation":"Executive Director & Empanelled MoSJE Officer","phone":"+91 98100 45672"}','{"vanNumber":"DL-1VA-9034","status":"Emergency Unit Ready","driverContact":"+91 98711 23419"}',28.6139,77.2090,350,12000,45,120,ARRAY['NITI Aayog','DUSIB','MoSJE SMILE','12A 80G']),
('ngo-3','Apna Ghar Ashram','RJ/2014/0078912','Jaipur & Delhi NCR','Rajasthan','+91 94140 23456','help@apnagharashram.org','Helpless, sick, mentally ill destitute rehabilitation','Gold','Verified',true,'NITI Aayog & Ministry of Social Justice',true,'MoSJE/SMILE/2019/RJ-001','12A & 80G Compliant (CIT/BTP/12A/8892)','RJ/DSW/REHAB/2012/045','National Highway 11, Jaswant Nagar, Bharatpur, Rajasthan - 321001','{"name":"Dr. B.M. Bhardwaj","designation":"National Chief Medical Rehabilitation Officer","phone":"+91 94140 23456"}','{"vanNumber":"RJ-05-PA-1102","status":"Field Patrol Unit","driverContact":"+91 94141 55678"}',26.9124,75.7873,800,28000,60,200,ARRAY['NITI Aayog','MoSJE SMILE','12A 80G']),
('ngo-4','Koshish (TISS Field Action Project)','MH/2011/0045120','Mumbai','Maharashtra','+91 22 2552 5000','koshish@tiss.edu','De-criminalization of beggary & holistic family tracing','Gold','Verified',true,'NITI Aayog & Tata Institute of Social Sciences (TISS)',true,'MoSJE/SMILE/2021/MH-009','12A & 80G Validated (MH/IT/12A/2011/K-90)','MCGM/SWD/MUM/2016/078','TISS Campus, V.N. Purav Marg, Deonar, Mumbai - 400088','{"name":"Prof. Mohd. Tarique","designation":"Project Director & National Legal Advisor on Beggary Laws","phone":"+91 98200 66781"}','{"vanNumber":"MH-03-CB-6701","status":"Social Outreach Van Active","driverContact":"+91 99691 12345"}',19.0760,72.8777,150,3200,12,40,ARRAY['NITI Aayog','TISS','MoSJE SMILE','12A 80G']),
('ngo-5','Aashray Adhikar Abhiyan','DL/2013/0061245','Delhi','Delhi','+91 11 2382 1178','aaa@delhihomeless.org','Shelter rights, medical rescue & reintegration','Silver','Verified',true,'NITI Aayog & Delhi Social Welfare Board',true,'MoSJE/SMILE/2022/DL-028','12A & 80G Certified (DEL/12A/2013/A-11)','DUSIB/SH/OLD-DELHI/2015/044','S-421, Greater Kailash Part 1, New Delhi - 110048','{"name":"Paramjeet Kaur","designation":"Director of Homeless Rescue Services","phone":"+91 98112 34901"}','{"vanNumber":"DL-3C-AL-5082","status":"Night Patrol Dispatched","driverContact":"+91 98734 56123"}',28.6500,77.2300,200,5100,25,80,ARRAY['NITI Aayog','MoSJE SMILE','12A 80G']),
('ngo-6','Snehadeep Trust for the Disabled','KA/2015/0089341','Bengaluru','Karnataka','+91 80 2548 6890','snehadeep@blr.org','Disabled beggars and abandoned senior citizens','Silver','Verified',true,'NITI Aayog & Karnataka State Directorate of Empowerment',true,'MoSJE/SMILE/2022/KA-011','12A & 80G Certified (BLR/12A/2015/S-772)','BBMP/SWD/BLR/2017/029','Cox Town, Jeevanahalli Main Road, Bengaluru, Karnataka - 560005','{"name":"K.G. Mohan","designation":"Nodal Officer for Persons with Disabilities","phone":"+91 98450 12890"}','{"vanNumber":"KA-04-ME-3120","status":"Accessible Ambulance Van Ready","driverContact":"+91 98455 77123"}',12.9716,77.5946,90,1800,8,30,ARRAY['NITI Aayog','Karnataka DSE','MoSJE SMILE','12A 80G'])
on conflict (id) do nothing;

-- Seed Reports
insert into reports (id, person_type, estimated_age, condition, location, photo, reported_at, status, assigned_ngo, assigned_ngo_id, reported_by, urgency, current_stage, timeline)
values
('SC-2026-8841','Elderly Man','65-70','Needs medical attention & shelter, difficulty walking','{"address":"Near Old Delhi Railway Station, Gate 2","city":"New Delhi","lat":28.6608,"lng":77.2280}','https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&auto=format&fit=crop&q=60','15 mins ago','Rescue Team Dispatched','SPYM (Society for Promotion of Youth & Masses)','ngo-2','Citizen Reporter (Aakash M.)','High',2,'[{"title":"Report Geotagged & Authenticated","time":"15 mins ago","completed":true,"note":"Location verified via GPS"},{"title":"Assigned to MoSJE-Empanelled NGO","time":"12 mins ago","completed":true,"note":"Transmitted to SPYM Delhi"},{"title":"Rescue Van Dispatched","time":"6 mins ago","completed":true,"note":"Field team en route. ETA ~10 mins"},{"title":"Shelter Admission & Medical Rehabilitation","time":"Pending arrival","completed":false,"note":"Direct admission to SPYM DUSIB Night Shelter"}]'),
('SC-2026-7219','Mother with Child','28-30 (Child ~3)','Hungry, living under flyover, child looks dehydrated','{"address":"Near Guindy Flyover, Anna Salai","city":"Chennai","lat":13.0067,"lng":80.2024}','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&auto=format&fit=crop&q=60','1 hour ago','Rescue Van Dispatched','Atchayam Trust','ngo-1','Citizen Reporter (Priya S.)','Critical',2,'[{"title":"Report Geotagged & Authenticated","time":"1 hour ago","completed":true,"note":"Child Welfare emergency priority logged"},{"title":"Assigned to MoSJE-Empanelled NGO","time":"50 mins ago","completed":true,"note":"Atchayam Trust notified"},{"title":"Rescue Van Dispatched","time":"35 mins ago","completed":true,"note":"Team lead Dr. P. Naveen Kumar in charge"},{"title":"Shelter Admission & Medical Rehabilitation","time":"Pending","completed":false,"note":"Coordinating with Child Welfare Committee (CWC)"}]'),
('SC-2026-6104','Elderly Woman','75+','Appears confused, memory loss, sitting near temple steps','{"address":"Dadar West, near Kabutar Khana","city":"Mumbai","lat":19.0178,"lng":72.8478}','https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60','3 hours ago','Rehabilitated & Safe','Koshish (TISS Field Action Project)','ngo-4','Citizen Reporter (Rohan K.)','Medium',3,'[{"title":"Report Geotagged & Authenticated","time":"3 hours ago","completed":true,"note":"Dadar West coordinates verified"},{"title":"Assigned to MoSJE-Empanelled NGO","time":"2.5 hours ago","completed":true,"note":"Koshish TISS project team mobilized"},{"title":"Rescue Van Dispatched","time":"2 hours ago","completed":true,"note":"Field officer safely received senior citizen"},{"title":"Shelter Admission & Medical Rehabilitation","time":"30 mins ago","completed":true,"note":"Admitted safely to senior transit care"}]')
on conflict (id) do nothing;
