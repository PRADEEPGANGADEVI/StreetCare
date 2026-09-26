/**
 * StreetCare India - Supabase Database Service Layer
 * All app data access goes through these functions.
 */
import { supabase } from './supabaseClient';

// NGOs

export async function getAllNGOs() {
  const { data, error } = await supabase
    .from('ngos')
    .select('*')
    .order('cases_resolved', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getVerifiedNGOs() {
  const { data, error } = await supabase
    .from('ngos')
    .select('*')
    .eq('is_govt_verified', true)
    .eq('status', 'Verified')
    .order('cases_resolved', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getNGOById(id) {
  const { data, error } = await supabase
    .from('ngos')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Reports

export async function getAllReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*, ngos:assigned_ngo_id(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(normalizeReport);
}

export async function getReportById(caseId) {
  if (!caseId) return null;
  const { data, error } = await supabase
    .from('reports')
    .select('*, ngos:assigned_ngo_id(*)')
    .ilike('id', caseId.trim())
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeReport(data) : null;
}

export async function saveReport(reportData) {
  const row = {
    id: reportData.id,
    person_type: reportData.personType,
    estimated_age: reportData.estimatedAge,
    condition: reportData.condition,
    location: reportData.location,
    photo: reportData.photo ?? null,
    reported_at: reportData.reportedAt,
    status: reportData.status,
    assigned_ngo: reportData.assignedNGO ?? null,
    assigned_ngo_id: reportData.assignedNGOId ?? null,
    reported_by: reportData.reportedBy ?? 'Anonymous',
    urgency: reportData.urgency,
    current_stage: reportData.currentStage ?? 0,
    timeline: reportData.timeline ?? [],
  };
  const { data, error } = await supabase
    .from('reports')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return normalizeReport(data);
}

export async function updateReportStatus(id, newStatus, currentStage) {
  const update = { status: newStatus };
  if (currentStage !== undefined) update.current_stage = currentStage;
  const { data, error } = await supabase
    .from('reports')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return normalizeReport(data);
}

// NGO Registrations

export async function submitNGORegistration(formData) {
  const row = {
    ngo_name: formData.ngoName,
    darpan_id: formData.darpanId,
    pan: formData.pan,
    registration_type: formData.registrationType,
    city: formData.city,
    state: formData.state,
    address: formData.address,
    contact_person: formData.contactPerson,
    email: formData.email,
    phone: formData.phone,
    shelter_capacity: parseInt(formData.shelterCapacity, 10) || 0,
    has_rescue_van: formData.hasRescueVan === 'Yes',
    has_12a_80g: formData.has12A80G === 'Yes',
    focus_area: formData.focusArea,
  };
  const { data, error } = await supabase
    .from('ngo_registrations')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Proposals

export async function sendProposal({ ngoId, userName, userPhone, message }) {
  const { data, error } = await supabase
    .from('proposals')
    .insert({ ngo_id: ngoId, user_name: userName, user_phone: userPhone, message })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProposalsForNGO(ngoId) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('ngo_id', ngoId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateProposalStatus(id, status) {
  const { data, error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Helpers

function normalizeReport(row) {
  return {
    id: row.id,
    personType: row.person_type,
    estimatedAge: row.estimated_age,
    condition: row.condition,
    location: row.location,
    photo: row.photo,
    reportedAt: row.reported_at,
    status: row.status,
    assignedNGO: row.assigned_ngo,
    assignedNGOData: row.ngos ?? null,
    reportedBy: row.reported_by,
    urgency: row.urgency,
    currentStage: row.current_stage,
    timeline: row.timeline ?? [],
    createdAt: row.created_at,
  };
}